import anime from 'animejs/lib/anime.es.js';

anime({
    targets: 'path',
    strokeDashoffset: function(el) {
      var pathLength = el.getTotalLength();
      console.log('lenght:', pathLength);
      el.setAttribute('stroke-dasharray', pathLength);
      return [-pathLength, 0];
    },
    stroke: {
      value: function(el, i) {
        console.log('in stroke: i:', i, 'rgb(200,'+ i * 60 +',150)');
        return 'rgb(200,'+ i * 60 +',150)'; 
      },
      easing: 'linear',
      duration: 2000,
    },
    strokeWidth: {
      value: 6 + 8,
      easing: 'linear',
      delay: function(el, i) { 
        return 1200 + (i * 40); 
      },
      duration: 800,
    },
    delay: function(el, i) { 
      return i * 60; 
    },
    duration: 1200,
    easing: 'easeOutExpo',
    loop: true,
    direction: 'alternate'
  });