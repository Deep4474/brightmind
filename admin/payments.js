(async function(){
  function $q(sel){return document.querySelector(sel)}
  function $qa(sel){return Array.from(document.querySelectorAll(sel))}

  const tbody = $q('#payments-table tbody');

  async function loadPayments(){
    try{
      const res = await fetch('/api/admin/payments');
      if(!res.ok) throw new Error('Failed to load payments');
      const data = await res.json();
      render(data.payments || []);
    }catch(e){
      console.error('Could not load payments', e.message);
      tbody.innerHTML = '<tr><td colspan="6">Could not load payments</td></tr>';
    }
  }

  function render(payments){
    if(!payments || !payments.length){
      tbody.innerHTML = '<tr><td colspan="6">No payments found</td></tr>';
      return;
    }

    tbody.innerHTML = payments.map(p=>{
      const status = (p.status||'pending');
      const amount = (typeof p.amount === 'number') ? ('$' + p.amount.toLocaleString()) : (p.amount || '$0');
      return `<tr data-id="${p.id}" data-userid="${p.userId}">
        <td>${p.id}</td>
        <td>${escapeHtml(p.user_name || p.userId || 'User')}</td>
        <td>${amount}</td>
        <td>${escapeHtml(p.method || '')}</td>
        <td class="status">${escapeHtml(status)}</td>
        <td class="actions">${status.toLowerCase() === 'pending' ? '<button class="approve">Approve</button>' : '<span>—</span>'}</td>
      </tr>`;
    }).join('\n');

    // attach handlers
    $qa('.approve').forEach(btn=>btn.addEventListener('click', onApprove));
  }

  function escapeHtml(str){
    if(!str && str !== 0) return '';
    return String(str).replace(/[&<>"']/g, function(s){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
    });
  }

  async function onApprove(e){
    const tr = e.target.closest('tr');
    const paymentId = tr.dataset.id;
    const userId = tr.dataset.userid;

    if(!paymentId){ alert('Missing payment id'); return; }
    if(!userId){ if(!confirm('No user id attached. Approve payment record only?')) return; }

    // 1) Update payment status via admin payments endpoint
    try{
      const upd = await fetch('/api/admin/payments/' + encodeURIComponent(paymentId), {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status: 'completed' })
      });
      if(!upd.ok) throw new Error('Failed to update payment');
      const updated = await upd.json();
      console.log('Payment updated', updated);
    }catch(err){
      console.warn('Could not update payment record:', err.message);
      alert('Could not update payment');
      return;
    }

    // 2) If we have a userId, update the user's approval (this sets user.payment_status to completed)
    if(userId){
      try{
        const ures = await fetch('/api/user-payment-approval/' + encodeURIComponent(userId), {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ status: 'completed' })
        });
        if(!ures.ok) throw new Error('Failed to approve user');
        const udata = await ures.json();
        console.log('User approved', udata);
      }catch(err){
        console.warn('Could not update user payment status:', err.message);
        alert('Payment marked completed but could not update user status.');
        return;
      }
    }

    // 3) Optionally notify server to send notifications (best-effort)
    try{
      await fetch('/api/notify-user-approval',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: userId, paymentId: paymentId })
      });
    }catch(_){/* ignore */}

    // Update row status in UI
    tr.querySelector('.status').textContent = 'completed';
    tr.querySelector('.actions').innerHTML = '<span>Approved</span>';

    alert('Payment approved and user updated. User will be able to access the dashboard.');
  }

  // Initial load
  loadPayments();

  // Poll every 20s to refresh list
  setInterval(loadPayments, 20000);
})();