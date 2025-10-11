// Highlight active nav link
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href') || '';
    if((path === '' && href.endsWith('index.html')) || href.endsWith(path)){
      a.classList.add('active');
    }
  });
})();
