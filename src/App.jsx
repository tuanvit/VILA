import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [loadProgress, setLoadProgress] = React.useState(0);
  const framesRef = useRef([]);
  const [totalFrames, setTotalFrames] = React.useState(0);

  // Section 2: Amenities Explorer State
  const [activeAmenity, setActiveAmenity] = React.useState(0);

  // Section 3: VIP Reservation State
  const [formData, setFormData] = React.useState({ name: '', phone: '' });
  const [interest, setInterest] = React.useState('penthouse');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = React.useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const amenitiesData = [
    {
      cx: 100,
      cy: 90,
      name: "SÂN ĐÁP TRỰC THĂNG DÂN DỤNG",
      title: "PRIVILEGED HELIPAD",
      desc: "Tọa lạc tại đỉnh cao nhất của tòa tháp, sân đáp trực thăng tiêu chuẩn quốc tế mang lại sự cơ động tối đa và quyền riêng tư tuyệt đối cho những chuyến đi của chủ nhân thượng lưu.",
      level: "TẦNG THƯỢNG (ROOFTOP)",
      area: "420 M²",
      status: "SẴN SÀNG",
      img: "/images/amenity_helipad.png"
    },
    {
      cx: 100,
      cy: 200,
      name: "HỒ BƠI VÔ CỰC CHÂN MÂY",
      title: "SKY INFINITY POOL",
      desc: "Trải mình tại độ cao hơn 150m, làn nước tràn viền hòa vào đường chân trời tạo nên một trải nghiệm bơi lội giữa không trung kỳ vĩ, bao trọn toàn cảnh thành phố rực rỡ.",
      level: "TẦNG 45 (LEVEL 45)",
      area: "350 M²",
      status: "24/7 VIP",
      img: "/images/amenity_pool.png"
    },
    {
      cx: 80,
      cy: 320,
      name: "HẦM RƯỢU VANG & CIGAR LOUNGE",
      title: "WINE & CIGAR LOUNGE",
      desc: "Hầm rượu được kiểm soát nhiệt độ và độ ẩm tuyệt đối, lưu giữ hàng trăm nhãn hiệu rượu vang danh tiếng thế giới, kết hợp không gian lounge bọc da cao cấp và gỗ tuyết tùng quý.",
      level: "TẦNG BÁN HẦM (BASEMENT)",
      area: "180 M²",
      status: "THƯ THÁI",
      img: "/images/amenity_wine.png"
    },
    {
      cx: 120,
      cy: 410,
      name: "RẠP CHIẾU PHIM PRIVATE LUXURY",
      title: "VIP PRIVATE CINEMA",
      desc: "Hệ thống âm thanh Dolby Atmos 12.2 tiêu chuẩn phòng thu kết hợp màn chiếu cong 4K sắc nét và 12 ghế nằm da chỉnh điện sang trọng, mang rạp hát đẳng cấp về ngay tư gia.",
      level: "TẦNG HẦM 1 (SUB-LEVEL 1)",
      area: "120 M²",
      status: "RIÊNG TƯ",
      img: "/images/amenity_cinema.png"
    }
  ];

  const showcaseCards = [
    {
      index: "01",
      title: "THE SKY PENTHOUSE",
      desc: "Tuyệt tác thông tầng ngự trị đỉnh cao thành phố, kiến tạo không gian sống tự do giữa những tầng mây rộng lớn. Nơi ánh hoàng hôn nhuộm vàng những ô kính cao kịch trần, mở ra tầm nhìn kiêu hãnh không giới hạn.",
      img: "/images/sky_penthouse.png",
      cta: "KHÁM PHÁ CHI TIẾT"
    },
    {
      index: "02",
      title: "THE OASIS POOL VILLA",
      desc: "Ốc đảo biệt lập xanh mát, nơi kiến trúc đá tự nhiên vững chãi giao hòa cùng sự mềm mại của cỏ cây nhiệt đới. Điểm nhấn là hồ bơi vô cực rộng lớn phản chiếu bầu trời đêm lấp lánh và sảnh lounge ngoài trời thời thượng.",
      img: "/images/oasis_pool_villa.png",
      cta: "CHIÊM NGƯỠNG KHÔNG GIAN"
    },
    {
      index: "03",
      title: "THE HERITAGE SUITE",
      desc: "Không gian nghỉ ngơi thấm đẫm hơi thở nghệ thuật đương đại, chế tác thủ công hoàn toàn từ các loại gỗ quý lâu năm và đá cẩm thạch nguyên khối. Mỗi đường nét kiến trúc đều kể một câu chuyện về sự tinh hoa và đẳng cấp.",
      img: "/images/heritage_suite.png",
      cta: "TRẢI NGHIỆM ĐỘC QUYỀN"
    }
  ];

  // 3D Tilt Card handlers
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const tiltX = (x / (rect.width / 2)) * 10; // max 10 degrees
    const tiltY = -(y / (rect.height / 2)) * 10;
    
    const spotX = ((e.clientX - rect.left) / rect.width) * 100;
    const spotY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTilt({ x: tiltX, y: tiltY });
    setSpotlight({ x: spotX, y: spotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  // Video Extraction & First Timeline ScrollTrigger
  useEffect(() => {
    const videoUrl = "/videos/Hailuo_Video_Generate a cinematic 4K video _511598578743226369.mp4";
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Optimized frame rate to speed up initial load while keeping the scrubbing buttery smooth
    const frameRate = 16;
    
    const extractFrames = async () => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const duration = video.duration;
      const total = Math.floor(duration * frameRate);
      setTotalFrames(total);
      
      // Set canvas size based on video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const frames = [];
      
      // Extract and cache all frames during the loading overlay to keep scroll-scrubbing lag-free
      for (let i = 0; i < total; i++) {
        video.currentTime = i / frameRate;
        
        await new Promise(resolve => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });

        try {
          const bitmap = await createImageBitmap(video);
          frames.push(bitmap);
          setLoadProgress(Math.round(((i + 1) / total) * 100));
        } catch (err) {
          console.error("Frame extraction error at index", i, err);
        }
      }

      framesRef.current = frames;
      renderFrame(0);
      initAnimations(total);
      setIsLoaded(true);
    };

    const initAnimations = (total) => {
      const proxy = { frame: 0 };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          renderFrame(Math.floor(proxy.frame));
        }
      });

      // Animate frame index
      tl.to(proxy, {
        frame: total - 1,
        ease: "none",
        duration: 1
      }, 0);

      // Progress bar
      tl.to(".progress-fill", {
        height: "100%",
        ease: "none"
      }, 0);

      // Fade out fixed footer as video scrubbing reaches end
      tl.to(".footer", {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.1,
        ease: "power2.inOut"
      }, 0.85);
    };

    const renderFrame = (index) => {
      const bitmap = framesRef.current[index];
      if (bitmap && ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(bitmap, 0, 0);
      }
    };

    extractFrames();

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      framesRef.current.forEach(b => b.close());
    };
  }, []);

  // Lock body scroll while loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoaded]);

  // Secondary GSAP scroll effects for the new sections (Runs only after assets loaded)
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      // 1. Hero Content Fade Out (independent ScrollTrigger)
      gsap.fromTo(".hero-content", 
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -40,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "40% top",
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );

      // 2. Video Content Section reveals (.content-section)
      const contentSections = gsap.utils.toArray(".content-section");
      contentSections.forEach((section) => {
        const reveal = section.querySelector(".section-reveal");
        const callouts = section.querySelectorAll(".callout");
        
        gsap.fromTo(reveal,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            }
          }
        );

        if (callouts.length) {
          gsap.fromTo(callouts,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play reverse play reverse",
              }
            }
          );
        }
      });

      // 3. Horizontal Scroll section pinning and sliding
      const pin = gsap.fromTo(
        ".horizontal-scroll-inner",
        { x: 0 },
        {
          x: "-200vw",
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-scroll-outer",
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        }
      );

      // 4. Parallax effect on cards' images inside horizontal scroll
      const cards = gsap.utils.toArray(".horizontal-card");
      cards.forEach((card) => {
        const img = card.querySelector(".horizontal-card-img");
        
        gsap.fromTo(img, 
          { x: "-8%" },
          {
            x: "8%",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: pin.scrollTrigger?.animation,
              start: "left right",
              end: "right left",
              scrub: true
            }
          }
        );
      });

      // 5. Reveal animations for amenities and reservation sections
      gsap.fromTo(".amenities-explorer-reveal",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".amenities-explorer",
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(".vip-reservation-reveal",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".vip-reservation",
            start: "top 70%",
          }
        }
      );

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger !== containerRef.current) {
          t.kill();
        }
      });
    };
  }, [isLoaded]);

  const activeScannerY = amenitiesData[activeAmenity].cy;

  return (
    <div className={`app-container ${isLoaded ? 'is-loaded' : 'is-loading'}`}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="loader-logo">THE PINNACLE</div>
            <p className="loader-status">ĐANG TỐI ƯU HÓA TRẢI NGHIỆM ĐIỆN ẢNH...</p>
            <div className="loader-bar">
               <div className="loader-progress" style={{ width: `${loadProgress}%`, animation: 'none', transform: 'none' }}></div>
            </div>
            <div className="loader-percentage">{loadProgress}%</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header glass">
        <div className="logo">THE PINNACLE</div>
        <nav className="nav">
          <a href="#home">TRANG CHỦ</a>
          <a href="#residences">KHÔNG GIAN</a>
          <a href="#amenities">TIỆN ÍCH</a>
          <a href="#residences-showcase">KIỆT TÁC</a>
          <a href="#amenities-explorer">BẢN ĐỒ TIỆN ÍCH</a>
          <a href="#vip-booking" className="cta">LIÊN HỆ VIP</a>
        </nav>
      </header>

      {/* Hero Section & Scroll-Scrub video */}
      <main ref={containerRef} className="scroll-container" id="home">
        <section className="hero-section">
          <div className="video-wrapper">
            <canvas
              ref={canvasRef}
              className="scrub-canvas"
            />
            <div className="video-overlay"></div>
          </div>

          <div className="hero-content">
            <div className="hero-text-wrap">
              <h1 className="hero-title">HÀNH TRÌNH CHẠM ĐẾN <br/> <span className="gold-text">SỰ HOÀN MỸ</span></h1>
              <p className="hero-subtitle">Cuộn chuột để bắt đầu chuyến tham quan</p>
              <div className="scroll-indicator">
                <div className="arrow-down"></div>
              </div>
            </div>
          </div>
          
          <div className="progress-bar-wrap">
             <div className="progress-bar">
                <div className="progress-fill"></div>
             </div>
          </div>
        </section>

        {/* Dynamic Content Sections overlaying video */}
        <div className="content-layers">
          <section className="content-section" id="residences">
            <div className="section-reveal">
              <span className="accent-line"></span>
              <h2>KHÔNG GIAN SỐNG THƯỢNG LƯU</h2>
              <p>Khám phá thiết kế thông tầng kỳ vĩ cùng nội thất được chế tác tinh xảo từ những vật liệu quý hiếm nhất.</p>
            </div>
            <div className="callouts">
               <div className="callout" style={{top: '15%', right: '10%'}}>KIẾN TRÚC THÔNG TẦNG</div>
               <div className="callout" style={{bottom: '15%', left: '10%'}}>KHÔNG GIAN BẾP ĐẲNG CẤP</div>
            </div>
          </section>

          <section className="content-section" id="amenities">
            <div className="section-reveal">
              <span className="accent-line"></span>
              <h2>TIỆN ÍCH ĐẶC QUYỀN</h2>
              <p>Mỗi chi tiết được kiến tạo để phục vụ lối sống xa hoa, mang lại sự thư thái tuyệt đối giữa lòng đô thị.</p>
            </div>
            <div className="callouts">
               <div className="callout" style={{top: '20%', right: '20%'}}>TẦM NHÌN PANORAMA</div>
               <div className="callout" style={{bottom: '20%', right: '10%'}}>HỒ BƠI VÔ CỰC</div>
            </div>
          </section>
        </div>
      </main>

      {/* SECTION 1: MASTERPIECE SPACE SHOWCASE (Horizontal Scroll Gallery) */}
      <section className="horizontal-scroll-outer" id="residences-showcase">
        <div className="horizontal-scroll-inner">
          {showcaseCards.map((card, i) => (
            <div key={i} className="horizontal-card">
              <div className="horizontal-card-left">
                <div className="horizontal-card-index">{card.index}</div>
                <h3 className="horizontal-card-title">{card.title}</h3>
                <p className="horizontal-card-desc">{card.desc}</p>
                <a href="#vip-booking" className="btn-gold">{card.cta}</a>
              </div>
              <div className="horizontal-card-right">
                <div className="horizontal-card-img-wrap">
                  <img src={card.img} alt={card.title} className="horizontal-card-img" />
                  <div className="horizontal-card-glass-overlay"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: EXCLUSIVE AMENITIES (Interactive Blueprint Explorer with background images) */}
      <section className="amenities-explorer" id="amenities-explorer">
        <div className="amenities-explorer-reveal">
          <div className="amenities-explorer-title-wrap">
            <p>Bản Đồ Kiến Trúc</p>
            <h2>TIỆN ÍCH ĐỘC BẢN</h2>
          </div>

          <div className="amenities-explorer-grid">
            <div className="amenities-list">
              {amenitiesData.map((item, i) => (
                <div 
                  key={i} 
                  className={`amenity-item ${activeAmenity === i ? 'active' : ''}`}
                  onClick={() => setActiveAmenity(i)}
                  onMouseEnter={() => setActiveAmenity(i)}
                  style={{ backgroundImage: `url(${item.img})` }}
                >
                  <div className="amenity-item-content">
                    <div className="amenity-header-row">
                      <span className="amenity-number">0{i+1}</span>
                      <span className="amenity-title">{item.title}</span>
                    </div>
                    <p className="amenity-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="blueprint-visualizer">
              <div className="blueprint-panel">
                <div className="blueprint-panel-row">
                  <span>VỊ TRÍ:</span>
                  <span className="blueprint-panel-value">{amenitiesData[activeAmenity].level}</span>
                </div>
                <div className="blueprint-panel-row">
                  <span>DIỆN TÍCH:</span>
                  <span className="blueprint-panel-value">{amenitiesData[activeAmenity].area}</span>
                </div>
                <div className="blueprint-panel-row">
                  <span>TRẠNG THÁI:</span>
                  <span className="blueprint-panel-value">{amenitiesData[activeAmenity].status}</span>
                </div>
                <div className="blueprint-panel-row">
                  <span>TỌA ĐỘ:</span>
                  <span className="blueprint-panel-value">X: {amenitiesData[activeAmenity].cx} | Y: {amenitiesData[activeAmenity].cy}</span>
                </div>
              </div>

              <svg viewBox="0 0 200 500" style={{ width: '80%', height: '80%', stroke: 'rgba(255,255,255,0.08)', fill: 'none' }}>
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Building Silhouette */}
                <path d="M 60,480 L 60,380 L 50,380 L 50,250 L 70,250 L 70,80 L 130,80 L 130,250 L 150,250 L 150,380 L 140,380 L 140,480 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <path d="M 75,480 L 75,90 M 125,480 L 125,90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="5,5" />
                
                {/* Floors lines */}
                <line x1="40" y1="100" x2="160" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="40" y1="200" x2="160" y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="40" y1="300" x2="160" y2="300" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="40" y1="400" x2="160" y2="400" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                {/* Laser scan line */}
                <line 
                  x1="30" 
                  y1={activeScannerY} 
                  x2="170" 
                  y2={activeScannerY} 
                  stroke="var(--color-gold)" 
                  strokeWidth="1" 
                  style={{ 
                    filter: 'drop-shadow(0 0 6px var(--color-gold))',
                    transition: 'y 0.5s cubic-bezier(0.25, 1, 0.5, 1)' 
                  }} 
                />
                
                {/* Hotspot dots */}
                {amenitiesData.map((item, idx) => (
                  <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setActiveAmenity(idx)}>
                    {activeAmenity === idx && (
                      <circle cx={item.cx} cy={item.cy} r="14" fill="none" stroke="var(--color-gold)" strokeWidth="1">
                        <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={item.cx} cy={item.cy} r="6" fill={activeAmenity === idx ? "var(--color-gold)" : "rgba(255,255,255,0.25)"} style={{ transition: 'all 0.3s ease' }} />
                    
                    {activeAmenity === idx && (
                      <path 
                        d={`M ${item.cx} ${item.cy} L ${item.cx > 100 ? item.cx + 25 : item.cx - 25} ${item.cy - 20} H ${item.cx > 100 ? 175 : 25}`} 
                        stroke="var(--color-gold)" 
                        strokeWidth="0.5" 
                        strokeDasharray="3,3" 
                        style={{ transition: 'all 0.5s ease' }}
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VIP RESERVATION CONCIERGE (3D Tilt card booking form) */}
      <section className="vip-reservation" id="vip-booking">
        <div className="vip-reservation-reveal">
          <div className="tilt-card-container">
            <div 
              ref={cardRef}
              className="tilt-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 80%), rgba(12, 12, 12, 0.75)`
              }}
            >
              <div className="tilt-card-inner">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit}>
                    <h3 className="vip-form-title">ĐĂNG KÝ ĐẶC QUYỀN</h3>
                    <p className="vip-form-subtitle">VIP RESERVATION & CONCIERGE</p>
                    
                    <div className="form-group">
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input" 
                        placeholder=" "
                        required
                      />
                      <label htmlFor="name" className="form-label">DANH XƯNG & HỌ TÊN</label>
                    </div>

                    <div className="form-group">
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input" 
                        placeholder=" "
                        required
                      />
                      <label htmlFor="phone" className="form-label">SỐ ĐIỆN THOẠI CÁ NHÂN</label>
                    </div>

                    <div className="form-group">
                      <span className="interest-selector-label">LOẠI HÌNH QUAN TÂM</span>
                      <div className="interest-chips">
                        <div 
                          className={`interest-chip ${interest === 'penthouse' ? 'active' : ''}`}
                          onClick={() => setInterest('penthouse')}
                        >
                          Penthouse
                        </div>
                        <div 
                          className={`interest-chip ${interest === 'villa' ? 'active' : ''}`}
                          onClick={() => setInterest('villa')}
                        >
                          Pool Villa
                        </div>
                        <div 
                          className={`interest-chip ${interest === 'duplex' ? 'active' : ''}`}
                          onClick={() => setInterest('duplex')}
                        >
                          Duplex
                        </div>
                      </div>
                    </div>

                    <div className="btn-submit-container">
                      <button type="submit" className="btn-submit">
                        GỬI YÊU CẦU ĐẶC QUYỀN
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="vip-letter">
                    <div className="vip-letter-stamp">VIP</div>
                    <h3>THƯ XÁC NHẬN ĐẶC QUYỀN</h3>
                    <p className="vip-letter-body">
                      Kính gửi Quý khách {formData.name.toUpperCase()},
                      {"\n\n"}
                      Yêu cầu đặt lịch tham quan và đăng ký đặc quyền cho dòng sản phẩm {interest.toUpperCase()} tại The Pinnacle Villa của Quý khách đã được tiếp nhận thành công.
                      {"\n\n"}
                      Hệ thống đang chuyển thông tin tới Ban quản lý Trải nghiệm Khách hàng VIP. Chuyên viên tư vấn cấp cao sẽ liên hệ trực tiếp đến số điện thoại {formData.phone} trong vòng 15 phút để sắp xếp đón tiếp Quý khách một cách chu đáo và bảo mật nhất.
                      {"\n\n"}
                      Chân thành cảm ơn sự đồng hành của Quý khách.
                    </p>
                    <div className="vip-letter-signature">
                      THE PINNACLE CONCIERGE
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original fixed minimalist footer (visible only during video tour) */}
      <footer className="footer">
        <div className="footer-left">© 2026 THE PINNACLE VILLA • KIẾN TẠO BỞI KLING AI</div>
        <div className="footer-right">PHIÊN BẢN GIỚI HẠN</div>
      </footer>

      {/* NEW PERMANENT RICH FOOTER (at the very bottom of document flow) */}
      <footer className="rich-footer">
        <div className="rich-footer-grid">
          <div className="footer-brand">
            <h3>THE PINNACLE</h3>
            <p>Kiệt tác bất động sản hàng hiệu ngự trị tại đỉnh cao kiêu hãnh của thành phố. Nơi mỗi căn hộ là một di sản độc bản được lưu truyền.</p>
          </div>
          <div className="footer-links-col">
            <h4>LIÊN KẾT</h4>
            <ul className="footer-links">
              <li><a href="#home">Trang Chủ</a></li>
              <li><a href="#residences">Không Gian Sống</a></li>
              <li><a href="#residences-showcase">Bộ Sưu Tập Kiệt Tác</a></li>
              <li><a href="#amenities-explorer">Bản Đồ Tiện Ích</a></li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>DỊCH VỤ</h4>
            <ul className="footer-links">
              <li><a href="#vip-booking">Đặt Lịch Tham Quan VIP</a></li>
              <li><a href="#vip-booking">Tải Catalog Dự Án</a></li>
              <li><a href="#vip-booking">Tư Vấn Thiết Kế Riêng</a></li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>LIÊN HỆ</h4>
            <div className="footer-contact-item">
              <span>ĐỊA CHỈ DỰ ÁN</span>
              Đại lộ Vọng Cảnh, Khu đô thị mới Thượng Lưu, Hà Nội
            </div>
            <div className="footer-contact-item">
              <span>HOTLINE VIP</span>
              1800 9000 (Tư vấn 24/7)
            </div>
            <div className="footer-contact-item">
              <span>EMAIL TRỢ LÝ VIP</span>
              vip@thepinnacle.vn
            </div>
          </div>
        </div>
        <div className="rich-footer-bottom">
          <div>© 2026 THE PINNACLE VILLA. ALL RIGHTS RESERVED.</div>
          <div>BẢO MẬT THÔNG TIN • ĐẶC QUYỀN GIỚI HẠN</div>
        </div>
      </footer>

      {/* Styles local to this layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        .app-container {
          position: relative;
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: #000;
        }
        
        .app-container.is-loaded {
          opacity: 1;
        }

        .loader-overlay {
          position: fixed;
          inset: 0;
          background: #050505;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .loader-content {
          text-align: center;
        }

        .loader-logo {
          font-family: var(--font-serif);
          font-size: 3rem;
          letter-spacing: 0.5em;
          margin-bottom: 10px;
          color: #fff;
          background: linear-gradient(to bottom, #fff, var(--color-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .loader-status {
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          margin-bottom: 40px;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .loader-bar {
          width: 300px;
          height: 1px;
          background: rgba(255,255,255,0.03);
          margin: 0 auto 20px;
          overflow: hidden;
          position: relative;
        }

        .loader-progress {
          height: 100%;
          background: var(--color-gold);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .loader-percentage {
          font-size: 0.9rem;
          font-weight: 200;
          opacity: 0.4;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.1em;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 30px 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          mix-blend-mode: exclusion;
        }

        .logo {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.3em;
        }

        .nav a {
          margin-left: 40px;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          opacity: 0.6;
          transition: all 0.4s ease;
        }

        .nav a:hover {
          opacity: 1;
          color: var(--color-gold);
        }

        .nav .cta {
          border: 1px solid rgba(255,255,255,0.2);
          padding: 10px 25px;
          backdrop-filter: blur(10px);
        }

        .scroll-container {
          height: 900vh;
          position: relative;
        }

        .hero-section {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .scrub-canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          filter: contrast(1.1) brightness(1.03) saturate(1.05);
          will-change: transform;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%),
                      linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 10%;
          will-change: opacity, transform;
        }

        .hero-title {
          font-size: clamp(2rem, 6.5vw, 4.5rem);
          max-width: 1000px;
          margin-bottom: 30px;
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.02em;
          text-shadow: 0 10px 50px rgba(0,0,0,0.9);
          opacity: 1;
        }

        .gold-text {
          color: var(--color-gold);
          font-style: italic;
        }

        .hero-subtitle {
          font-size: 0.9rem;
          color: #fff;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          opacity: 0.5;
        }

        .scroll-indicator {
          margin-top: 80px;
          opacity: 0.5;
        }

        .arrow-down {
          width: 1px;
          height: 100px;
          background: linear-gradient(to bottom, #fff, transparent);
          position: relative;
        }

        .arrow-down::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -4px;
          width: 10px;
          height: 10px;
          border-right: 1px solid #fff;
          border-bottom: 1px solid #fff;
          transform: rotate(45deg);
        }

        .progress-bar-wrap {
          position: fixed;
          right: 50px;
          top: 50%;
          transform: translateY(-50%);
          height: 40vh;
          width: 1px;
          background: rgba(255,255,255,0.05);
          z-index: 10;
        }

        .progress-fill {
          width: 2px;
          height: 0%;
          background: var(--color-gold);
          margin-left: -0.5px;
          box-shadow: 0 0 20px var(--color-gold);
        }

        .content-layers {
          position: relative;
          z-index: 5;
        }

        .content-section {
          height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 12%;
          pointer-events: none;
          position: relative;
        }

        .section-reveal {
          max-width: 700px;
          opacity: 0;
          transform: translateY(80px);
          will-change: opacity, transform;
        }

        .section-reveal h2 {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin-bottom: 25px;
          color: #fff;
        }

        .section-reveal p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.7;
          font-weight: 300;
        }

        .content-section:nth-child(1) { margin-top: 250vh; }
        .content-section:nth-child(2) { margin-top: 200vh; }

        .callouts {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .callout {
          position: absolute;
          padding: 15px 25px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 2px solid var(--color-gold);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          opacity: 0;
          transform: scale(0.95);
          will-change: opacity, transform;
          color: #fff;
          text-transform: uppercase;
        }

        .accent-line {
          display: block;
          width: 80px;
          height: 1px;
          background: var(--color-gold);
          margin-bottom: 30px;
        }

        .footer {
          position: fixed;
          bottom: 30px;
          width: 100%;
          padding: 0 6%;
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.3);
          z-index: 10;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
      `}} />
    </div>
  );
};

export default App;
