
  (function(){
    function injectCF(){
      var s = document.createElement('script');
      s.defer = true;
      s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.setAttribute('data-cf-beacon', '{"token": "cd3db41765ea4c17be0930b3f94e3c3a"}');
      document.head.appendChild(s);
    }
    function shouldLoad(){
      try{
        var start = (performance.timing && performance.timing.navigationStart) || 0;
        var elapsed = performance.now ? performance.now() : (Date.now() - start);
        return elapsed <= 2000;
      }catch(e){ return false; }
    }
    document.addEventListener('DOMContentLoaded', function(){ if(shouldLoad()) injectCF(); });
  })();