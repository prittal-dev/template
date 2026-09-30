import{x as v,j as e}from"./index-Srm5_fWi.js";import{r as n}from"./vendor-react-nf7bT_Uh.js";function z({productId:d,onNavigate:g}){const[p,h]=n.useState("salient"),c=n.useRef(null),[s,k]=n.useState(v);n.useEffect(()=>{fetch("http://localhost:5000/api/products").then(t=>t.json()).then(t=>{t.success&&Array.isArray(t.data)&&t.data.length>0&&k(t.data)}).catch(t=>console.log("Using static product details fallback"))},[]);const i=s&&s.length>0?s.find(t=>String(t.id)===String(d)||String(t.slug)===String(d))||s[0]:v[0]||{},[m,f]=n.useState((i==null?void 0:i.img)||"");n.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"}),i!=null&&i.img&&f(i.img)},[d,i]);const[b,F]=n.useState(0),[x,a]=n.useState(()=>{if(typeof window<"u"){if(window.innerWidth<576)return 2;if(window.innerWidth<900)return 3;if(window.innerWidth<1200)return 4}return 5});n.useEffect(()=>{const t=()=>{window.innerWidth<576?a(2):window.innerWidth<900?a(3):window.innerWidth<1200?a(4):a(5)};return window.addEventListener("resize",t,{passive:!0}),t(),()=>window.removeEventListener("resize",t)},[]);const u=(s||[]).filter(t=>t&&String(t.id)!==String(i==null?void 0:i.id)).map(t=>({id:t.id,slug:t.slug,name:(t.category||t.title||"").replace(/<br\s*\/?>/gi," "),img:t.img})),j=Math.max(0,u.length-x),S=()=>{F(t=>t>=j?0:t+1)},C=()=>{F(t=>t<=0?j:t-1)},E=()=>{c.current&&c.current.scrollIntoView({behavior:"smooth"})},y=i!=null&&i.images&&i.images.length>0?i.images:i!=null&&i.img?[i.img]:[];return e.jsxs("div",{className:"product-details-page",style:{paddingTop:"75px",backgroundColor:"#FAF6F2",minHeight:"100vh",fontFamily:"Montserrat, sans-serif"},children:[e.jsx("div",{style:{maxWidth:"1280px",margin:"0 auto",padding:"1.5rem 2rem 0"},children:e.jsxs("button",{onClick:()=>g("products"),style:{display:"inline-flex",alignItems:"center",gap:"8px",background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"0.9rem",fontWeight:"700",letterSpacing:"0.5px"},children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]}),"BACK TO PRODUCTS"]})}),e.jsxs("section",{className:"pd-hero-section",style:{maxWidth:"1280px",margin:"0 auto",padding:"2.5rem 2rem 3rem",display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:"3rem",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",width:"100%"},children:[e.jsx("div",{className:"pd-image-box",children:e.jsx("img",{src:m,alt:(i==null?void 0:i.title)||"Product",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transition:"all 0.35s ease"}})}),y.length>1&&e.jsx("div",{style:{display:"flex",gap:"1rem",marginTop:"1.5rem",flexWrap:"wrap",justifyContent:"center"},children:y.map((t,r)=>e.jsx("button",{onClick:()=>f(t),style:{width:"68px",height:"68px",borderRadius:"12px",backgroundColor:"#FFFFFF",border:m===t?"2.5px solid #D32F2F":"1px solid #CBD5E1",padding:"6px",cursor:"pointer",boxShadow:m===t?"0 6px 18px rgba(211,47,47,0.3)":"0 2px 8px rgba(0,0,0,0.05)",transition:"all 0.25s ease"},children:e.jsx("img",{src:t,alt:`View ${r+1}`,style:{width:"100%",height:"100%",objectFit:"contain"}})},r))})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:"800",color:"#D32F2F",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"0.5rem"},children:"ELECTWELL INDUSTRIAL SERIES"}),e.jsx("h1",{style:{fontSize:"clamp(1.75rem, 3.5vw, 2.75rem)",fontWeight:"900",color:"#1E293B",margin:"0 0 1rem 0",lineHeight:"1.15"},children:i==null?void 0:i.title}),e.jsx("p",{style:{fontSize:"1.05rem",fontWeight:"600",color:"#B71C1C",marginBottom:"1.5rem",lineHeight:"1.4"},children:i==null?void 0:i.tagline}),e.jsx("p",{style:{fontSize:"0.98rem",lineHeight:"1.7",color:"#475569",marginBottom:"2rem"},children:(i==null?void 0:i.overview)||(i==null?void 0:i.desc)}),e.jsx("div",{className:"pd-motor-grid",children:(i==null?void 0:i.motorOptions)&&i.motorOptions.map((t,r)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",backgroundColor:"#FFFFFF",padding:"0.85rem 1.25rem",borderRadius:"12px",border:"1px solid #E2E8F0",boxShadow:"0 4px 12px rgba(0,0,0,0.02)"},children:[e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"#D32F2F",flexShrink:0}}),e.jsx("span",{style:{fontSize:"0.88rem",fontWeight:"700",color:"#1E293B"},children:t})]},r))})]})]}),e.jsxs("section",{className:"pd-action-section",children:[e.jsxs("button",{onClick:E,className:"pd-action-btn pd-btn-specs",children:[e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#D32F2F",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),e.jsx("polyline",{points:"10 9 9 9 8 9"})]}),e.jsxs("div",{style:{textAlign:"left"},children:[e.jsx("span",{style:{display:"block",fontSize:"0.95rem",fontWeight:"900",color:"#D32F2F",lineHeight:"1.2"},children:"TECHNICAL"}),e.jsx("span",{style:{display:"block",fontSize:"0.75rem",color:"#64748B",letterSpacing:"1px",fontWeight:"700"},children:"SPECIFICATIONS"})]})]}),e.jsxs("a",{href:"#footer-section",className:"pd-action-btn pd-btn-brochure",children:[e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#FFFFFF",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})}),e.jsxs("div",{style:{textAlign:"left"},children:[e.jsx("span",{style:{display:"block",fontSize:"0.95rem",fontWeight:"900",color:"#FFFFFF",lineHeight:"1.2"},children:"DOWNLOAD"}),e.jsx("span",{style:{display:"block",fontSize:"0.75rem",color:"#FFD54F",letterSpacing:"1px",fontWeight:"700"},children:"BROCHURE"})]})]})]}),e.jsxs("section",{style:{width:"100%",position:"relative"},children:[e.jsxs("div",{className:"pd-tabs-container",children:[e.jsx("button",{onClick:()=>h("salient"),className:`pd-tab-btn ${p==="salient"?"active":""}`,children:"SALIENT FEATURES"}),e.jsx("button",{onClick:()=>h("optional"),className:`pd-tab-btn ${p==="optional"?"active":""}`,children:"OPTIONAL ACCESSORIES & HIGHLIGHTS"})]}),e.jsx("div",{className:"pd-features-content",style:{width:"100%",backgroundColor:"#5C1515",backgroundImage:"linear-gradient(rgba(178, 34, 34, 0.92), rgba(139, 0, 0, 0.96)), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",padding:"4rem 2rem"},children:e.jsx("div",{style:{maxWidth:"1280px",margin:"0 auto"},children:e.jsx("ul",{style:{listStyle:"none",padding:0,margin:0,display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.5rem"},children:(p==="salient"?(i==null?void 0:i.salientFeatures)||[]:(i==null?void 0:i.certifications)||[]).map((t,r)=>e.jsxs("li",{style:{display:"flex",alignItems:"flex-start",gap:"1rem",color:"#FFFFFF",fontSize:"0.95rem",lineHeight:"1.5",fontWeight:"500"},children:[e.jsx("span",{style:{backgroundColor:"#FFD54F",color:"#8B0000",borderRadius:"50%",width:"22px",height:"22px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:"900",flexShrink:0,marginTop:"2px"},children:"✓"}),e.jsx("span",{children:t})]},r))})})})]}),i.models&&i.models.length>0&&e.jsxs("section",{style:{maxWidth:"1280px",margin:"0 auto",padding:"5rem 2rem 2rem"},children:[e.jsxs("div",{className:"awards-header-wrap",style:{marginBottom:"2.5rem"},children:[e.jsx("div",{className:"tapered-header-line"}),e.jsxs("h2",{className:"awards-two-tone-title",style:{fontSize:"clamp(2rem, 3.8vw, 3rem)",margin:0},children:[e.jsx("span",{className:"title-blue",children:"PRODUCT RANGE"}),e.jsx("span",{className:"title-purple",children:"& MODELS"})]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"2rem"},children:i.models.map((t,r)=>e.jsxs("div",{style:{backgroundColor:"#FFFFFF",borderRadius:"20px",border:"1px solid #E2E8F0",boxShadow:"0 10px 30px rgba(0,0,0,0.04)",padding:"2rem",display:"flex",flexDirection:"column",transition:"all 0.3s ease"},onMouseEnter:o=>{o.currentTarget.style.transform="translateY(-5px)",o.currentTarget.style.boxShadow="0 15px 35px rgba(211,47,47,0.15)"},onMouseLeave:o=>{o.currentTarget.style.transform="translateY(0)",o.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.04)"},children:[e.jsx("div",{style:{height:"180px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem"},children:e.jsx("img",{src:t.img,alt:t.name,style:{maxHeight:"100%",maxWidth:"100%",objectFit:"contain"}})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"},children:[e.jsx("span",{style:{fontSize:"0.78rem",fontWeight:"800",color:"#D32F2F",textTransform:"uppercase",letterSpacing:"1px"},children:t.type}),e.jsx("span",{style:{backgroundColor:"#FFF5F5",color:"#B71C1C",fontSize:"0.82rem",fontWeight:"800",padding:"0.25rem 0.75rem",borderRadius:"20px",border:"1px solid #FFCDD2"},children:t.size})]}),e.jsx("h3",{style:{fontSize:"1.3rem",fontWeight:"800",color:"#1E293B",margin:"0 0 1rem 0"},children:t.name}),e.jsxs("div",{style:{backgroundColor:"#F8FAFC",borderRadius:"12px",padding:"1rem",marginBottom:"1.25rem",display:"flex",justifyContent:"space-around",textAlign:"center"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"0.72rem",color:"#64748B",fontWeight:"700",textTransform:"uppercase"},children:"Wattage"}),e.jsx("span",{style:{display:"block",fontSize:"1rem",fontWeight:"800",color:"#D32F2F"},children:t.specs.wattage})]}),e.jsx("div",{style:{width:"1px",backgroundColor:"#E2E8F0"}}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"0.72rem",color:"#64748B",fontWeight:"700",textTransform:"uppercase"},children:"Speed"}),e.jsx("span",{style:{display:"block",fontSize:"1rem",fontWeight:"800",color:"#1E293B"},children:t.specs.rpm})]})]}),e.jsx("ul",{style:{listStyle:"none",padding:0,margin:"0 0 1.25rem 0",flex:1},children:t.features.map((o,l)=>e.jsxs("li",{style:{fontSize:"0.88rem",color:"#475569",marginBottom:"0.4rem",display:"flex",alignItems:"flex-start",gap:"8px"},children:[e.jsx("span",{style:{color:"#D32F2F",fontWeight:"900"},children:"•"}),e.jsx("span",{children:o})]},l))}),e.jsxs("div",{style:{borderTop:"1px solid #F1F5F9",paddingTop:"1rem",fontSize:"0.82rem",fontWeight:"700",color:"#0F766E",display:"flex",alignItems:"center",gap:"6px"},children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),e.jsx("span",{children:t.winding})]})]},r))})]}),e.jsxs("section",{ref:c,className:"pd-specs-section",children:[e.jsxs("div",{className:"awards-header-wrap",style:{marginBottom:"1.5rem"},children:[e.jsx("div",{className:"tapered-header-line"}),e.jsxs("h2",{className:"awards-two-tone-title",style:{fontSize:"clamp(1.75rem, 5vw, 3rem)",margin:0,lineHeight:"1.15"},children:[e.jsx("span",{className:"title-blue",children:"TECHNICAL"})," ",e.jsx("span",{className:"title-purple",children:"SPECIFICATIONS"})]})]}),(i==null?void 0:i.specs)&&e.jsxs("div",{className:"pd-specs-hint",children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M8 7l-5 5 5 5M16 7l5 5-5 5"})}),e.jsx("span",{children:"Scroll table sideways for all models"})]}),i!=null&&i.specs?e.jsx("div",{className:"pd-table-wrapper",children:e.jsxs("table",{className:"pd-specs-table",children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#1E293B",color:"#FFFFFF"},children:i.specs.columns.map((t,r)=>e.jsx("th",{children:t},r))})}),e.jsx("tbody",{children:i.specs.rows.map((t,r)=>e.jsxs("tr",{style:{backgroundColor:r%2===0?"#FFFFFF":"#F8FAFC",transition:"background-color 0.2s ease"},onMouseEnter:o=>o.currentTarget.style.backgroundColor="#FFF5F5",onMouseLeave:o=>o.currentTarget.style.backgroundColor=r%2===0?"#FFFFFF":"#F8FAFC",children:[e.jsx("td",{style:{fontWeight:"700",color:"#1E293B"},children:t.name}),i.specs.columns.slice(1).map((o,l)=>{const w=`col${l+1}`;return e.jsx("td",{style:{fontWeight:"600",color:"#475569"},children:t[w]!==void 0?t[w]:""},l)})]},r))})]})}):e.jsx("div",{style:{backgroundColor:"#FFFFFF",borderRadius:"16px",padding:"3rem",textAlign:"center",border:"1px solid #E2E8F0"},children:e.jsx("p",{style:{margin:0,color:"#64748B",fontSize:"1rem",fontWeight:"600"},children:"Standard technical specifications available upon request or in product catalog."})})]}),e.jsx("section",{style:{backgroundColor:"#FAF6F2",padding:"4rem 2rem 6rem"},children:e.jsxs("div",{style:{maxWidth:"1280px",margin:"0 auto"},children:[e.jsxs("div",{className:"portfolio-header-row",children:[e.jsx("div",{className:"portfolio-header-accent"}),e.jsx("h2",{className:"portfolio-section-title",children:"OTHER PRODUCTS IN PORTFOLIO"}),e.jsxs("div",{className:"portfolio-nav-btns",children:[e.jsx("button",{onClick:C,"aria-label":"Previous Related Product",className:"portfolio-nav-btn",children:e.jsx("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M15 18l-6-6 6-6"})})}),e.jsx("button",{onClick:S,"aria-label":"Next Related Product",className:"portfolio-nav-btn",children:e.jsx("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 18l6-6-6-6"})})})]})]}),e.jsx("div",{className:"portfolio-carousel-wrapper",children:e.jsx("div",{className:"portfolio-carousel-track",style:{transform:`translateX(-${b*(100/x)}%)`,WebkitTransform:`translateX(-${b*(100/x)}%)`},children:u.map((t,r)=>e.jsxs("div",{onClick:()=>g("product-details",t.slug||t.id),className:"portfolio-item-card",children:[e.jsx("div",{className:"portfolio-img-box",children:e.jsx("img",{src:t.img,alt:t.name,className:"portfolio-img"})}),e.jsx("div",{className:"portfolio-item-label",children:t.name})]},r))})})]})}),e.jsx("style",{children:`
        .portfolio-header-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .portfolio-header-accent {
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D32F2F);
        }

        .portfolio-section-title {
          font-size: clamp(1.4rem, 2.4vw, 2.2rem);
          font-weight: 800;
          color: #1E293B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .portfolio-nav-btns {
          display: flex;
          gap: 1.5rem;
          margin-left: auto;
        }

        .portfolio-nav-btn {
          background: none;
          border: none;
          color: #D32F2F;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .portfolio-nav-btn:hover {
          transform: scale(1.15);
        }

        .portfolio-carousel-wrapper {
          overflow: hidden;
          width: 100%;
          padding-bottom: 2rem;
          position: relative;
        }

        .portfolio-carousel-track {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: 100% !important;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), -webkit-transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
          will-change: transform;
        }

        .portfolio-item-card {
          flex: 0 0 20% !important;
          width: 20% !important;
          max-width: 20% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
          padding: 0 10px !important;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .portfolio-img-box {
          height: 240px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          padding: 1.25rem;
          box-shadow: 0 6px 18px rgba(0,0,0,0.04);
          box-sizing: border-box;
          width: 100%;
        }

        .portfolio-item-card:hover .portfolio-img-box {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(211,47,47,0.18);
          border-color: rgba(211,47,47,0.35);
        }

        .portfolio-img {
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 auto !important;
        }

        .portfolio-item-label {
          padding: 1rem 0.5rem;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 800;
          color: #1E293B;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          line-height: 1.35;
        }

        .pd-image-box {
          width: 100%;
          height: 420px;
          background-color: #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 20px 45px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .pd-motor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .pd-action-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem 3rem 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .pd-action-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          box-sizing: border-box;
        }

        .pd-action-btn:hover {
          transform: translateY(-2px);
        }

        .pd-btn-specs {
          background-color: #FFFFFF;
          border: 1.5px solid #D32F2F;
          box-shadow: 0 4px 14px rgba(211,47,47,0.12);
        }

        .pd-btn-brochure {
          background-color: #D32F2F;
          border: 1.5px solid #D32F2F;
          color: #FFFFFF;
          box-shadow: 0 6px 18px rgba(211,47,47,0.3);
        }

        .pd-tabs-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-wrap: wrap;
        }

        .pd-tab-btn {
          padding: 1.2rem 3rem;
          font-size: 1rem;
          font-weight: 800;
          color: #FFFFFF;
          background-color: #A0AABF;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border-radius: 8px 8px 0 0;
          flex: 1 1 auto;
          text-align: center;
        }

        .pd-tab-btn.active {
          background-color: #8B0000;
        }

        .pd-specs-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem 2rem;
        }

        .pd-specs-hint {
          display: none;
          align-items: center;
          gap: 8px;
          color: #D32F2F;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: #FFF5F5;
          padding: 0.4rem 0.85rem;
          border-radius: 20px;
          border: 1px solid #FFCDD2;
          width: fit-content;
        }

        .pd-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          background-color: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          width: 100%;
        }

        .pd-specs-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
          text-align: left;
          font-family: Montserrat, sans-serif;
        }

        .pd-specs-table th {
          padding: 1.2rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          border-bottom: 3px solid #D32F2F;
          white-space: nowrap;
        }

        .pd-specs-table td {
          padding: 1.1rem 1.75rem;
          font-size: 0.95rem;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        @media (max-width: 1200px) {
          .portfolio-item-card {
            flex: 0 0 25% !important;
            width: 25% !important;
            max-width: 25% !important;
          }
        }

        @media (max-width: 900px) {
          .portfolio-item-card {
            flex: 0 0 33.333% !important;
            width: 33.333% !important;
            max-width: 33.333% !important;
          }
        }

        @media (max-width: 992px) {
          .pd-hero-section {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 640px) {
          .pd-image-box {
            height: 280px !important;
            padding: 1.5rem !important;
            border-radius: 16px !important;
          }
          .pd-motor-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
            margin-bottom: 1.75rem !important;
          }
          .pd-action-section {
            padding: 0 1.25rem 2.5rem 1.25rem !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.85rem !important;
          }
          .pd-action-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.85rem 1.25rem !important;
          }
          .pd-tabs-container {
            padding: 0 1rem !important;
            flex-direction: column !important;
          }
          .pd-tab-btn {
            padding: 0.85rem 1rem !important;
            font-size: 0.82rem !important;
            border-radius: 6px 6px 0 0 !important;
          }
          .pd-features-content {
            padding: 2.5rem 1.25rem !important;
          }
          .pd-specs-section {
            padding: 2rem 1rem 3.5rem 1rem !important;
          }
          .pd-specs-hint {
            display: inline-flex !important;
          }
          .pd-specs-table {
            min-width: 480px !important;
          }
          .pd-specs-table th {
            padding: 0.85rem 1rem !important;
            font-size: 0.82rem !important;
          }
          .pd-specs-table td {
            padding: 0.75rem 1rem !important;
            font-size: 0.82rem !important;
          }
        }

        @media (max-width: 576px) {
          .portfolio-item-card {
            flex: 0 0 50% !important;
            width: 50% !important;
            max-width: 50% !important;
            padding: 0 6px !important;
          }
          .portfolio-img-box {
            height: 180px;
            padding: 0.85rem;
          }
        }
      `})]})}export{z as default};
