import{j as e,b as C,i as I,c as N,e as f,w as T,g as b,h as E,k as y,l as S,m as w,n as F,o as v,p as A,f as L,q as M,r as P,t as W,u as R}from"./index-B2KuqegM.js";import{r as c,R as D}from"./vendor-react-nf7bT_Uh.js";import{I as $}from"./InfrastructureCapabilitiesSection-CiwNxySF.js";const g=[L,w,F,v,b,M,E,y,I,N,f,P,C,T,S,A,W,R],B=[],j=2025,G=1992,k=[{title:"Plast Alger Exhibition",desc:"Algeria Plastics, Composites & Industrial Ventilation Expo"},{title:"Plexpoindia International Expo",desc:"International Plastic, Electrical & Airflow Machinery Showcase"},{title:"Plastindia International Trade Fair",desc:"Global Heavy Duty Air Circulator & Ventilation Pavilion"},{title:"Electwell Industrial Expo",desc:"Annual Industrial Airflow & Motor Innovations Summit"},{title:"EEPC Top Exporter Awards",desc:"National Recognition for Engineering Export Excellence"},{title:"National Machinery & Motor Fair",desc:"Pioneering Heavy Duty Electrical Fan Motor Technologies"}];for(let r=j;r>=G;r--){const t=k[(j-r)%k.length],d=g[r*2%g.length],n=g[(r*2+1)%g.length],a=g[(r*2+2)%g.length],o=g[(r*2+3)%g.length];B.push({year:r,eventTitle:t.title,eventDesc:t.desc,photos:[{id:`${r}-1`,url:d,title:`${r} Exhibition Showcase 1`},{id:`${r}-2`,url:n,title:`${r} Exhibition Showcase 2`},{id:`${r}-3`,url:a,title:`${r} Exhibition Showcase 3`},{id:`${r}-4`,url:o,title:`${r} Exhibition Showcase 4`}]})}const H=[{id:"bis-testing-lab",title:"BIS COMPLIANT TESTING LAB",desc:"Bureau of Indian Standards Compliant R&D, Airflow Wind Tunnel & Electrical Safety Lab",photos:[{id:"b1",url:C,title:"BIS Compliant Testing Laboratory & Wind Tunnel Rig"},{id:"b2",url:I,title:"Aerodynamic Airflow Measurement Chamber"},{id:"b3",url:N,title:"High Voltage Insulation Breakdown Testing"},{id:"b4",url:f,title:"Dynamic Motor Balancing & Noise Spectrum Analyzer"}]},{id:"winding-section",title:"WINDING SECTION",desc:"High-Precision Automated Motor Coil Winding & Vacuum Pressure Impregnation Facility",photos:[{id:"w1",url:T,title:"Automatic CNC Motor Coil Winding Station"},{id:"w2",url:b,title:"Stator Slot Insulation & Coil Insertion Floor"},{id:"w3",url:E,title:"Class F/H Thermal Copper Wire Winding"},{id:"w4",url:y,title:"Varnish Vacuum Impregnation & Curing"}]},{id:"assembly-line",title:"ASSEMBLY LINE",desc:"Conveyorized High-Throughput Assembly Floor with Inline Quality Inspection",photos:[{id:"a1",url:S,title:"Conveyorized Fan Motor & Impeller Assembly Line"},{id:"a2",url:w,title:"Pneumatic Torque-Controlled Fastening Station"},{id:"a3",url:F,title:"100% Inline Voltage & Wattage Inspection"},{id:"a4",url:v,title:"Final Modular Packaging & Dispatch Preparation"}]},{id:"powder-coating-setup",title:"IN-HOUSE POWDER COATING & PRE-TREATMENT",desc:"7-Tank Chemical Dip Pre-Treatment & Electrostatic Powder Coating Oven Line",photos:[{id:"pc1",url:A,title:"Electrostatic Powder Coating Booth & Pre-Treatment Line"},{id:"pc2",url:L,title:"7-Tank Chemical Dip Pre-Treatment Facility"},{id:"pc3",url:M,title:"High-Temperature Powder Curing Oven"},{id:"pc4",url:P,title:"Weatherproof & Anti-Corrosion Coating Quality Inspection"}]},{id:"cnc-machining-section",title:"COMPUTER CONTROLLED MACHINING SECTION",desc:"Precision CNC Turning Centers, Lathes & In-House Die Tooling Machine Shop",photos:[{id:"cnc1",url:W,title:"Computer Controlled CNC Turning Center & Lathes"},{id:"cnc2",url:y,title:"Precision Rotor Shaft & Bearing Seat Boring"},{id:"cnc3",url:f,title:"In-House Die Tooling & Housing Stamping Shop"},{id:"cnc4",url:F,title:"Micron-Level Tolerance Dimensional Inspection"}]},{id:"fan-guard-unit",title:"IN-HOUSE FAN GUARD MANUFACTURING UNIT",desc:"Automated Wire Mesh Ring Bending, Spot Welding & Safety Guard Fabrication",photos:[{id:"fg1",url:R,title:"In-House Fan Guard Manufacturing & Wire Bending Unit"},{id:"fg2",url:v,title:"Multi-Spot Electric Resistance Welding Station"},{id:"fg3",url:b,title:"Aerodynamic Wire Mesh Guard Rim Flanging"},{id:"fg4",url:w,title:"Safety Compliant Finger Guard Quality Check"}]}],U=D.memo(function({item:t,onPhotoClick:d}){c.useRef(null);const[n,a]=c.useState(t.photos.length),[o,s]=c.useState(!0),h=[...t.photos,...t.photos,...t.photos,...t.photos],p=310+20,u=()=>{s(!0),a(i=>i-1)},m=()=>{s(!0),a(i=>i+1)},x=i=>{i.target===i.currentTarget&&(n>=t.photos.length*3?(s(!1),a(l=>l-t.photos.length*2)):n<t.photos.length&&(s(!1),a(l=>l+t.photos.length*2)))};return c.useEffect(()=>{if(!o){const i=setTimeout(()=>{s(!0)},50);return()=>clearTimeout(i)}},[o]),e.jsxs("div",{className:"year-gallery-row",children:[e.jsxs("div",{className:"year-info-col",children:[e.jsx("h2",{className:"year-big-title",children:t.year}),e.jsx("h3",{className:"year-event-name",children:t.eventTitle}),e.jsx("p",{className:"year-event-desc",children:t.eventDesc})]}),e.jsxs("div",{className:"year-carousel-col",children:[e.jsx("button",{onClick:u,className:"carousel-arrow-btn arrow-btn-left","aria-label":`Scroll ${t.year} gallery left`,children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M15 18l-6-6 6-6"})})}),e.jsx("button",{onClick:m,className:"carousel-arrow-btn arrow-btn-right","aria-label":`Scroll ${t.year} gallery right`,children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 18l6-6-6-6"})})}),e.jsx("div",{className:"year-photos-track-container",children:e.jsx("div",{className:"year-photos-track",onTransitionEnd:x,style:{transform:`translateX(-${n*p}px)`,transition:o?"transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)":"none"},children:h.map((i,l)=>e.jsxs("div",{className:"gallery-photo-card",onClick:()=>d(i.url),children:[e.jsx("img",{src:i.url,alt:i.title,className:"gallery-photo-img",loading:"lazy",decoding:"async"}),e.jsx("div",{className:"photo-card-overlay",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.5",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"}),e.jsx("line",{x1:"11",y1:"8",x2:"11",y2:"14"}),e.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"})]})})]},`${i.id}-inf-${l}`))})})]})]})}),Y=D.memo(function({item:t,onPhotoClick:d}){const[n,a]=c.useState(t.photos.length),[o,s]=c.useState(!0),h=[...t.photos,...t.photos,...t.photos,...t.photos],p=310+20,u=()=>{s(!0),a(i=>i-1)},m=()=>{s(!0),a(i=>i+1)},x=i=>{i.target===i.currentTarget&&(n>=t.photos.length*3?(s(!1),a(l=>l-t.photos.length*2)):n<t.photos.length&&(s(!1),a(l=>l+t.photos.length*2)))};return c.useEffect(()=>{if(!o){const i=setTimeout(()=>{s(!0)},50);return()=>clearTimeout(i)}},[o]),e.jsxs("div",{className:"year-gallery-row",children:[e.jsxs("div",{className:"year-info-col",children:[e.jsx("h2",{className:"infra-big-red-title",children:t.title}),e.jsx("p",{className:"year-event-desc",children:t.desc})]}),e.jsxs("div",{className:"year-carousel-col",children:[e.jsx("button",{onClick:u,className:"carousel-arrow-btn arrow-btn-left","aria-label":`Scroll ${t.title} gallery left`,children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M15 18l-6-6 6-6"})})}),e.jsx("button",{onClick:m,className:"carousel-arrow-btn arrow-btn-right","aria-label":`Scroll ${t.title} gallery right`,children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 18l6-6-6-6"})})}),e.jsx("div",{className:"year-photos-track-container",children:e.jsx("div",{className:"year-photos-track",onTransitionEnd:x,style:{transform:`translateX(-${n*p}px)`,transition:o?"transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)":"none"},children:h.map((i,l)=>e.jsxs("div",{className:"gallery-photo-card",onClick:()=>d(i.url),children:[e.jsx("img",{src:i.url,alt:i.title,className:"gallery-photo-img",loading:"lazy",decoding:"async"}),e.jsx("div",{className:"photo-card-overlay",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.5",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"}),e.jsx("line",{x1:"11",y1:"8",x2:"11",y2:"14"}),e.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"})]})})]},`${i.id}-infra-inf-${l}`))})})]})]})});function X(){const[r,t]=c.useState("events"),[d,n]=c.useState(null);return e.jsxs("div",{className:"page-container gallery-page-container",children:[e.jsxs("div",{style:{maxWidth:"1380px",margin:"0 auto",padding:"0 1.5rem"},children:[e.jsxs("div",{className:"gallery-header-section",children:[e.jsxs("h1",{className:"gallery-main-title",children:["SETTING STANDARDS IN INDUSTRIAL AIRFLOW:",e.jsx("br",{}),"OUR LOCAL & GLOBAL SHOWCASE"]}),e.jsxs("div",{className:"gallery-tabs-row",children:[e.jsx("button",{onClick:()=>t("events"),className:`gallery-tab-pill ${r==="events"?"active-tab":""}`,children:"EVENTS GALLERY"}),e.jsx("button",{onClick:()=>t("infrastructure"),className:`gallery-tab-pill ${r==="infrastructure"?"active-tab":""}`,children:"INFRASTRUCTURE"})]})]}),r==="events"&&e.jsx("div",{className:"timeline-list",children:B.map(a=>e.jsx(U,{item:a,onPhotoClick:o=>n(o)},a.year))}),r==="infrastructure"&&e.jsxs("div",{children:[e.jsx($,{}),e.jsx("div",{className:"timeline-list",style:{marginTop:"3rem"},children:H.map(a=>e.jsx(Y,{item:a,onPhotoClick:o=>n(o)},a.id))})]})]}),d&&e.jsx("div",{className:"lightbox-overlay",onClick:()=>n(null),children:e.jsxs("div",{className:"lightbox-content",onClick:a=>a.stopPropagation(),children:[e.jsx("button",{className:"lightbox-close-btn",onClick:()=>n(null),children:"×"}),e.jsx("img",{src:d,alt:"Enlarged Gallery Preview",className:"lightbox-img"})]})}),e.jsx("style",{children:`
        @keyframes shimmerWave {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmerWave 1.6s infinite linear;
          z-index: 1;
          border-radius: 14px;
        }

        .gallery-page-container {
          background-color: #FAF6F2;
          padding-top: 130px;
          padding-bottom: 90px;
          min-height: 100vh;
        }

        .gallery-header-section {
          margin-bottom: 4rem;
        }

        .gallery-main-title {
          font-family: 'Outfit', 'Montserrat', sans-serif;
          font-size: clamp(2.2rem, 4.2vw, 3.6rem);
          font-weight: 900;
          line-height: 1.22;
          letter-spacing: 0.2px;
          color: #D32F2F;
          background: linear-gradient(90deg, #D32F2F 0%, #B71C1C 50%, #8E0E0E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
        }

        .gallery-tabs-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .gallery-tab-pill {
          padding: 0.85rem 2.2rem;
          border-radius: 50px;
          font-family: 'Outfit', 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 1.2px;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          background-color: transparent;
          color: #1E293B;
        }

        .gallery-tab-pill.active-tab {
          background: linear-gradient(90deg, #D32F2F 0%, #B71C1C 100%);
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(211, 47, 47, 0.35);
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .year-gallery-row {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          align-items: center;
          background-color: #FFFFFF;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 12px 35px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }

        .year-info-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .year-big-title {
          font-family: 'Outfit', 'Montserrat', sans-serif;
          font-size: clamp(4rem, 5.5vw, 5.6rem);
          font-weight: 900;
          line-height: 0.95;
          background: linear-gradient(90deg, #D32F2F 0%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.75rem 0;
          letter-spacing: -1.5px;
        }

        .infra-big-red-title {
          font-family: 'Outfit', 'Montserrat', sans-serif;
          font-size: clamp(2.4rem, 3.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.08;
          color: #D32F2F;
          margin: 0 0 0.85rem 0;
          letter-spacing: -0.8px;
          text-transform: uppercase;
        }

        .year-event-name {
          font-family: 'Outfit', 'Montserrat', sans-serif;
          font-size: 1.18rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.5rem 0;
          line-height: 1.35;
        }

        .year-event-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.92rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
        }

        .year-carousel-col {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .year-photos-track-container {
          overflow: hidden;
          width: 100%;
          padding: 10px 5px;
        }

        .year-photos-track {
          display: flex;
          gap: 20px;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .gallery-photo-card {
          min-width: 310px;
          max-width: 310px;
          height: 230px;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.06);
          background-color: #FFFFFF;
          transition: transform 0.3s ease;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .gallery-photo-img {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          object-position: center;
          padding: 12px;
          transition: transform 0.3s ease;
        }

        .gallery-photo-card:hover .gallery-photo-img {
          transform: scale(1.05);
        }

        .photo-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(183, 28, 28, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-photo-card:hover .photo-card-overlay {
          opacity: 1;
        }

        .carousel-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #D97706;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.4);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .arrow-btn-left {
          left: 10px;
        }

        .arrow-btn-right {
          right: 10px;
        }

        .carousel-arrow-btn:hover {
          transform: translateY(-50%) scale(1.1);
          background: #B45309;
        }

        /* Infrastructure Grid */
        .infrastructure-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .infra-card {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .infra-card:hover {
          transform: translateY(-6px);
        }

        .infra-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
        }

        .infra-card-title {
          padding: 1.25rem;
          font-weight: 700;
          font-size: 0.95rem;
          color: #1E293B;
        }

        /* Lightbox Modal */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          backdrop-filter: blur(6px);
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          object-fit: contain;
        }

        .lightbox-close-btn {
          position: absolute;
          top: -45px;
          right: -10px;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-size: 2.8rem;
          cursor: pointer;
          line-height: 1;
        }

        /* Responsive Layout Adjustments */
        @media (max-width: 992px) {
          .year-gallery-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .year-big-title {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 640px) {
          .gallery-tab-pill {
            padding: 0.75rem 1.5rem;
            font-size: 0.85rem;
          }
          .gallery-photo-card {
            min-width: 250px;
            max-width: 250px;
            height: 180px;
          }
        }
      `})]})}export{X as default};
