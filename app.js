// Store engine (localStorage) + utilities
const Store = {
  key: 'pos_full_v1',
  state: {
    settings: {store:'Psycho Mode Foods', currency:'UGX', taxEnabled:false, taxRate:0.00, cashier:'Felix Kandie', receiptPrefix:'#'},
    departments: [{id:1,name:'Butchery'},{id:2,name:'Kitchen'}],
    products: [
      {id:1, name:'panfried beef', unit:'plate', price:7000, department_id:2, active:true},
      {id:2, name:'Beef', unit:'kg', price:17000, department_id:1, active:true},
      {id:3, name:'Chapati', unit:'piece', price:1000, department_id:2, active:true}
    ],
    receipts: [], // {id, number, status, customer, cashier, created_at, discountReceipt}
    items: [],    // {id, receipt_id, product_id, name, unit, price, qty, discount}
    payments: [], // {id, receipt_id, method, amount, tendered, change_due, created_at, ref}
    seq: 1000
  },
  load(){
    const raw = localStorage.getItem(this.key);
    if(raw){ try{ this.state = JSON.parse(raw); }catch(e){} }
  },
  save(){
    localStorage.setItem(this.key, JSON.stringify(this.state));
  },
  uid(){ this.state.seq++; return this.state.seq; },
  now(){ return new Date().toISOString(); }
};
Store.load();

function money(n, curr=Store.state.settings.currency){ return `${curr} ${(n||0).toFixed(2)}`; }

// Backup & Restore
function exportJSON(){
  const blob = new Blob([JSON.stringify(Store.state,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pos-backup.json';
  document.body.appendChild(a); a.click(); a.remove();
}
function importJSON(file, cb){
  const reader = new FileReader();
  reader.onload = () => {
    try{ Store.state = JSON.parse(reader.result); Store.save(); cb && cb(true); }
    catch(e){ alert('Invalid backup'); cb && cb(false); }
  };
  reader.readAsText(file);
}