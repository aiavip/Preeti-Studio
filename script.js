const nav=document.querySelector('.nav');
document.querySelector('.menu').addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const filters=document.querySelectorAll('.filter');
const items=document.querySelectorAll('.gallery-item');
filters.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    items.forEach(item=>item.style.display=(f==='all'||item.classList.contains(f))?'block':'none');
  });
});
document.getElementById('year').textContent=new Date().getFullYear();