let iconMenu = document.querySelector('.scrollupanim');

    let animationMenu = bodymovin.loadAnimation({
            container: iconMenu,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: "https://assets5.lottiefiles.com/packages/lf20_r4whjkob.json"
            
    });

    var directionMenu = 1;
      iconMenu.addEventListener('mouseenter', (e) => {
      animationMenu.setDirection(directionMenu);
      animationMenu.play();
    });

      iconMenu.addEventListener('mouseleave', (e) => {
      animationMenu.setDirection(-directionMenu);
      animationMenu.play();
    });
      iconMenu.addEventListener('click', (e) => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
        });
      });


    

    



