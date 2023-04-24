(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 색션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
    let enterNewScene = false; //새로운 scene이 시작된 순간 true
    let acc = 0.1;
	let delayedYOffset = 0;
	let rafId;
	let rafState;

    const sceneInfo = [
        {   
            //0
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                // start랑 end는 scrollRatio에서 시작하는 지점과 끝 지점 세팅(container전체에서 타임라인을 0~1로 봤을 때)
                videoImageCount: 422,
                imageSequence: [0, 421],
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {   
            //1
            type: 'sticky',
            heightNum: 4, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                messageA: document.querySelector('#scroll-section-1 .a'),
                messageB: document.querySelector('#scroll-section-1 .b'),
                pinA: document.querySelector('#scroll-section-1 .a .pin'),
                pinB: document.querySelector('#scroll-section-1 .b .pin'),
                canvas: document.querySelector('#image-canvas-0'),
                context: document.querySelector('#image-canvas-0').getContext('2d'),
                video: document.querySelector('.lipprint_device')
            },
            values: {
                canvas_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                video_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
                video_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                
                messageA_translateY_in: [20, 0, { start: 0.4, end: 0.45 }],
                messageA_opacity_in: [0, 1, { start: 0.4, end: 0.45 }],
                messageA_translateY_out: [0, -20, { start: 0.55, end: 0.6 }],
                messageA_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],

                messageB_translateY_in: [20, 0, { start: 0.7, end: 0.75 }],
                messageB_opacity_in: [0, 1, { start: 0.7, end: 0.75 }],
                messageB_translateY_out: [0, -20, { start: 0.8, end: 0.85 }],
                messageB_opacity_out: [1, 0, { start: 0.8, end: 0.85 }],

                pinA_scaleY: [0.5, 1, { start: 0.4, end: 0.45 }],
                pinA_opacity_in: [0, 1, { start: 0.4, end: 0.45 }],
                pinA_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],

                pinB_scaleY: [0.5, 1, { start: 0.7, end: 0.75 }],
                pinB_opacity_in: [0, 1, { start: 0.7, end: 0.75 }],
                pinB_opacity_out: [1, 0, { start: 0.8, end: 0.85 }]
            }
        },
        {   
            //2
            type: 'normal',
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {   
            //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                illustTitle: document.querySelector('#scroll-section-3 .others-text'),
                mobileTitle: document.querySelector('.illust_text_mo'),
                moreView: document.querySelector('.more-illust'),
                canvas: document.querySelector('#video-canvas-3'),
                context: document.querySelector('#video-canvas-3').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 29,
                imageSequence: [1, 29],
                canvas_opacity_in: [0, 1, { start: 0.02, end: 0.05 }],
                canvas_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                illustTitle_opacity_in: [0, 1, { start: 0.02, end: 0.05 }],
                illustTitle_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                mobileTitle_opacity_in: [0, 1, { start: 0.03, end: 0.05 }],
                moreView_opacity_in: [0, 1, { start: 0.03, end: 0.05 }],
                mobileTitle_opacity_out: [1, 0, { start: 0.7, end: 0.8 }],
                moreView_opacity_out: [1, 0, { start: 0.75, end: 0.85 }]
            }
        },
        {   
            //4
            type: 'sticky',
            heightNum: 4,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-4'),
                emoticonTitle: document.querySelector('#scroll-section-4 .others-text'),
                mainImage: document.querySelector('.rightimg'),
                mobileTitle: document.querySelector('.emoticon_text_mo'),
                chat01: document.querySelector('.chat_01'),
                chat02: document.querySelector('.chat_02'),
                moreView: document.querySelector('.moreview'),
                moveImages: document.querySelector('.bottom_section4')
            },
            values: {
                emoticonTitle_opacity_in: [0, 1, { start: 0.01, end: 0.03 }],
                emoticonTitle_opacity_out: [1, 0, { start: 0.79, end: 0.85 }],

                mainImage_opacity_in: [0, 1, { start: 0.02, end: 0.06 }],
                mainImage_opacity_out: [1, 0, { start: 0.79, end: 0.85 }],

                mobileTitle_opacity_in: [0, 1, { start: 0.06, end: 0.1 }],
                mobileTitle_opacity_out: [1, 0, { start: 0.7, end: 0.8 }],

                moreView_opacity_in: [0, 1, { start: 0.08, end: 0.12 }],
                moreView_opacity_out: [1, 0, { start: 0.7, end: 0.8 }],

                moveImages_opacity_in: [0, 1, { start: 0.07, end: 0.12 }],
                moveImages_opacity_out: [1, 0, { start: 0.7, end: 0.8 }],


                chat01_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                chat01_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],

                chat02_opacity_in: [0, 1, { start: 0.55, end: 0.6 }],
                chat02_opacity_out: [1, 0, { start: 0.7, end: 0.75 }]
            }
        },
        {   
            //5
            type: 'normal',
            // heightNum: 2,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-5')
            }
        }
    ];

    function addToCanvas(context, image) {
        var BgImage_1 = new Image;
        BgImage_1.src = './images/section_1.jpg';
        BgImage_1.onload = function() {
            sceneInfo[1].objs.context.drawImage(BgImage_1, 0, 0 ,1920, 1080);
        }
    }

    function setCanvasImages() {
        let imgElem;
        for (let i=0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./images/section_0/phone_${00000 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem3;
        for (let i=0; i < sceneInfo[3].values.videoImageCount; i++) {
            imgElem3 = new Image();
            imgElem3.src = `./images/section_3/Dune_${1 + i}.JPG`;
            sceneInfo[3].objs.videoImages.push(imgElem3);
        }
    }

    function checkMenu() {
        if (yOffset > 44) {
            document.body.classList.add('local-nav-sticky_on');
        } else {
            document.body.classList.remove('local-nav-sticky_on');
        }
    }

    function backdropFilter() {
        if (currentScene === 3) {
            document.body.classList.add('local-nav-sticky_off');
        } else {
            document.body.classList.remove('local-nav-sticky_off');
        }
    }


    function setLayout() {
        // 각 스크롤 색션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[1].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        let rv; //return해줄 value라고 지음
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

            break;

            case 1:

                if (scrollRatio <= 0.2) {
                    // in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }

                if (scrollRatio <= 0.2) {
                    // in
                    objs.video.style.opacity = calcValues(values.video_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.video.style.opacity = calcValues(values.video_opacity_out, currentYOffset);
                }

                if (scrollRatio <= 0.45) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinA.style.transform = `scaleY(${calcValues(values.pinA_scaleY, currentYOffset)})`; 
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinA.style.transform = `scaleY(${calcValues(values.pinA_scaleY, currentYOffset)})`; 
                }

                if (scrollRatio <= 0.75) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`; 
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`; 
                }

            break;


            case 3:

                if (scrollRatio <= 0.1) {
                    // in
                    objs.mobileTitle.style.opacity = calcValues(values.mobileTitle_opacity_in, currentYOffset);
                    objs.moreView.style.opacity = calcValues(values.moreView_opacity_in, currentYOffset);
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                    objs.illustTitle.style.opacity = calcValues(values.illustTitle_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.mobileTitle.style.opacity = calcValues(values.mobileTitle_opacity_out, currentYOffset);
                    objs.moreView.style.opacity = calcValues(values.moreView_opacity_out, currentYOffset);
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                    objs.illustTitle.style.opacity = calcValues(values.illustTitle_opacity_out, currentYOffset);
                }
            
            break;


            case 4:

            if (scrollRatio <= 0.07) {
                // in
                objs.mainImage.style.opacity = calcValues(values.mainImage_opacity_in, currentYOffset);
                objs.emoticonTitle.style.opacity = calcValues(values.emoticonTitle_opacity_in, currentYOffset);
            } else {
                // out
                objs.mainImage.style.opacity = calcValues(values.mainImage_opacity_out, currentYOffset);
                objs.emoticonTitle.style.opacity = calcValues(values.emoticonTitle_opacity_out, currentYOffset);
            }

            if (scrollRatio <= 0.15) {
                // in
                objs.mobileTitle.style.opacity = calcValues(values.mobileTitle_opacity_in, currentYOffset);
                objs.moreView.style.opacity = calcValues(values.moreView_opacity_in, currentYOffset);
                objs.moveImages.style.opacity = calcValues(values.moveImages_opacity_in, currentYOffset);
                
            } else {
                // out
                objs.mobileTitle.style.opacity = calcValues(values.mobileTitle_opacity_out, currentYOffset);
                objs.moreView.style.opacity = calcValues(values.moreView_opacity_out, currentYOffset);
                objs.moveImages.style.opacity = calcValues(values.moveImages_opacity_out, currentYOffset);
            }

            if (scrollRatio <= 0.2) {
                // in
                objs.chat01.style.opacity = calcValues(values.chat01_opacity_in, currentYOffset);
            } else {
                // out
                objs.chat01.style.opacity = calcValues(values.chat01_opacity_out, currentYOffset);
            }

            if (scrollRatio <= 0.6) {
                // in
                objs.chat02.style.opacity = calcValues(values.chat02_opacity_in, currentYOffset);
            } else {
                // out
                objs.chat02.style.opacity = calcValues(values.chat02_opacity_out, currentYOffset);
            }

            break;
        }
    }
    
    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // 스크롤이팩트가 필요한 영역일 때
        if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            document.body.classList.remove('scroll-effect-end');
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            if (currentScene === sceneInfo.length - 1) {
                document.body.classList.add('scroll-effect-end');
            }
            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return; // 화면이 바뀌는 순간 마이너스 뜨고 이상한 부분 해결

        playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        // 새로운 씬에 들어가는게 아닐 때만 실행
        if (!enterNewScene) {
            if (currentScene === 0 || currentScene === 3) {
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        addToCanvas();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (yOffset > 0) {
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }
        // document.querySelector('.loading').addEventListener('transitionend', (e) => {
        //     document.body.removeChild(e.currentTarget);
        // });
    });
     window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();
            backdropFilter();
    
            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                window.location.reload();
            }
        });

        window.addEventListener('orientationchange', () => {
            scrollTo(0, 0);
            setTimeout(() => {
                window.location.reload();    
            }, 500);
        });

    setCanvasImages();

})();