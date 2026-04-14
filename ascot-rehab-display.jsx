import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────
   DESIGN TOKENS — matches ascotrehab.com website exactly
   Font: Outfit | Primary: #612141 | Secondary: #83786F
───────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --plum:       #612141;
    --pd:         #4a1832;
    --pp:         #380f26;
    --pl:         #7a2a52;
    --ps:         #f9f2f5;
    --rose:       #c997ae;
    --warm:       #83786F;
    --wl:         #a09589;
    --ws:         #f7f5f3;
    --wp:         #ede9e5;
    --bd:         #e4dbd9;
    --white:      #fff;
    --tx:         #2c1a24;
    --tm:         #4a3f44;
    --mu:         #83786F;
    --font:       'Outfit', sans-serif;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes floatA   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-28px)} }
  @keyframes floatB   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14px,20px)} }
  @keyframes pulse    { 0%,100%{opacity:.45} 50%{opacity:1} }
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes statUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .orb-a { animation: floatA 14s ease-in-out infinite; }
  .orb-b { animation: floatB 18s ease-in-out infinite; }
  .fade-up { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up-2 { animation: fadeUp 0.65s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up-3 { animation: fadeUp 0.65s 0.2s cubic-bezier(0.22,1,0.36,1) both; }
  .sec-in { animation: fadeIn 0.35s ease; }
  .stat-in { animation: statUp 0.5s ease both; }

  /* Eyebrow — matches website .eyebrow component */
  .eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 10px; font-weight: 700; letter-spacing: .22em;
    text-transform: uppercase; color: var(--plum); margin-bottom: 10px;
  }
  .eyebrow::before {
    content:''; width:22px; height:2px;
    background: var(--warm); border-radius:1px; flex-shrink:0;
  }
  .eyebrow.lt { color: rgba(255,255,255,.75); }
  .eyebrow.lt::before { background: rgba(255,255,255,.35); }

  /* Section heading — matches website .sh */
  .sh {
    font-size: clamp(24px,3.2vw,38px);
    font-weight: 700; letter-spacing: -.03em; line-height: 1.1;
    color: var(--pd);
  }

  /* Cards */
  .card {
    background: var(--white);
    border: 1.5px solid var(--bd);
    border-radius: 16px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    cursor: pointer;
  }
  .card:hover { border-color: #c9b0bc; box-shadow: 0 6px 24px rgba(97,33,65,0.09); transform: translateY(-2px); }
  .card.on {
    background: var(--plum);
    border-color: var(--plum);
    box-shadow: 0 12px 40px rgba(97,33,65,0.3);
    transform: translateY(-3px);
  }

  /* Review card */
  .r-card {
    background: var(--white);
    border: 1.5px solid var(--bd);
    border-radius: 16px;
    padding: 22px;
  }

  /* Tag pill */
  .tag-pill {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 10px; font-weight: 600; letter-spacing: .15em;
    text-transform: uppercase;
  }

  /* Nav buttons */
  .nav-btn {
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    border-radius: 100px;
  }
  .nav-btn.on {
    background: var(--plum) !important;
    border-color: var(--plum) !important;
    color: #fff !important;
    box-shadow: 0 4px 16px rgba(97,33,65,0.3);
  }

  .scroll { overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(97,33,65,0.15) transparent; }
  .scroll::-webkit-scrollbar { width:3px; }
  .scroll::-webkit-scrollbar-thumb { background:rgba(97,33,65,0.2); border-radius:2px; }

  /* Marquee ticker */
  .marquee-track { display:flex; animation: marquee 28s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }
`;

/* ─── DATA (from website) ─── */
const heroSlides = [
  { eye:"South West London", h:"Recovery\nThrough\nExcellence.", b:"A specialist neurorehabilitation centre delivering expert care with compassion and precision." },
  { eye:"Innovation in Care",  h:"The Future\nof Neuro\nRehab.",      b:"Home to Fourier Intelligence's RehabHub — robotics-assisted recovery for life-changing results." },
  { eye:"Your Journey",        h:"Precision.\nCompassion.\nRecovery.", b:"Every patient receives a bespoke rehabilitation programme designed around their unique goals." },
];
const stats = [
  { n:"12+", l:"Years of Excellence" },
  { n:"2,000+", l:"Patients Treated" },
  { n:"12", l:"Specialist Therapists" },
  { n:"6", l:"Treatment Disciplines" },
];
const services = [
  { n:"01", tag:"Core",      tagBg:"var(--ps)",  tagC:"var(--pd)",  title:"Neurophysiotherapy",  desc:"Specialist physiotherapy for neurological conditions — stroke, brain injury, spinal cord injury — using evidence-based techniques to restore movement and independence." },
  { n:"02", tag:"Core",      tagBg:"var(--ps)",  tagC:"var(--pd)",  title:"Occupational Therapy", desc:"Helping patients return to meaningful daily activities through tailored rehabilitation: dressing, cooking, work, and beyond." },
  { n:"03", tag:"Specialist",tagBg:"var(--ws)",  tagC:"var(--warm)",title:"Hydrotherapy",          desc:"Warm-water therapy reducing pain and resistance, enabling movement not possible on land. Ideal for early rehab and complex pain management." },
  { n:"04", tag:"Robotics",  tagBg:"#f5f0e3",   tagC:"#7a6020",    title:"RehabHub",              desc:"Fourier Intelligence's state-of-the-art robotic technology. Upper and lower limb recovery powered by data and precision engineering." },
  { n:"05", tag:"Core",      tagBg:"var(--ps)",  tagC:"var(--pd)",  title:"Speech & Language",    desc:"Specialist support for communication, swallowing, and cognitive-linguistic skills after neurological injury." },
  { n:"06", tag:"Specialist",tagBg:"var(--ws)",  tagC:"var(--warm)",title:"Neuropsychology",       desc:"Therapy addressing mood, cognition, fatigue, and emotional wellbeing — the invisible dimensions of neurological recovery." },
];
const conditions = [
  { g:"I",   acc:"#1a6b8a", title:"Stroke Rehabilitation",   desc:"Intensive, goal-led therapy targeting movement, speech, and cognition after stroke. Early and late-stage programmes available." },
  { g:"II",  acc:"#7a3d8f", title:"Acquired Brain Injury",   desc:"Bespoke rehabilitation for traumatic and non-traumatic brain injury, supporting physical and cognitive recovery at every stage." },
  { g:"III", acc:"#1a7a5e", title:"Spinal Cord Injury",      desc:"Specialist programmes to maximise independence, mobility, and quality of life for spinal cord injury patients." },
  { g:"IV",  acc:"#8a5a1a", title:"Parkinson's Disease",     desc:"Evidence-based therapy including LSVT BIG and LOUD, exercise science, and functional skills to maintain independence." },
  { g:"V",   acc:"#6b4a1a", title:"Multiple Sclerosis",      desc:"Ongoing rehabilitation to manage MS symptoms and preserve function through patient-centred care." },
  { g:"VI",  acc:"#83786F", title:"Guillain-Barré Syndrome", desc:"Carefully paced rehabilitation rebuilding strength, coordination, and function during recovery from GBS." },
];
// Real Google Reviews from the website
const reviews = [
  { stars:5, text:"I had both physiotherapy and hydrotherapy at Ascot Rehab and couldn't be happier. The staff are amazing — friendly, caring, and incredibly knowledgeable. The hospital is brand new and all of their technology is state-of-the-art and very impressive.", author:"Jihan Natour", source:"Google Review · Verified" },
  { stars:5, text:"We can't speak highly enough of Ascot Rehab. Everyone — from physical and occupational therapy to the front desk — has been compassionate, supportive, and genuinely caring. We've seen a massive improvement in her walking stability.", author:"Ray Joseph", source:"Google Review · Verified" },
  { stars:5, text:"Great service, very welcoming staff with a commitment to care and support. Excellent knowledge per my particular diagnosis. Very satisfied and highly recommend.", author:"Martin Wallis", source:"Google Review · Verified" },
  { stars:5, text:"The centre is exceptionally clean and constantly maintained. Every member of staff is welcoming, caring, and always smiling. The physiotherapy team is both professional and friendly.", author:"miX perimental", source:"Google Review · Verified" },
];
const team = [
  { i:"BP", name:"Ben Payne",           role:"Clinical Advisor",          dept:"Advisory",          dC:"#612141", bio:"Clinical advisor supporting Ascot Rehab's therapy programmes and quality of care standards." },
  { i:"JO", name:"James Okafor",        role:"Lead Neurophysiotherapist",  dept:"Physiotherapy",     dC:"#1a5a7a", bio:"Specialist in spasticity management and robotic-assisted therapy. Advanced Bobath training, HCPC registered." },
  { i:"PN", name:"Priya Nair",          role:"Senior OT",                  dept:"Occ. Therapy",      dC:"#1a6a4a", bio:"Expert in cognitive rehabilitation and return-to-work programmes. Passionate about enabling independence." },
  { i:"AC", name:"Dr. Anna Chambers",   role:"Neuropsychologist",          dept:"Psychology",        dC:"#4a1a7a", bio:"Specialist in post-injury psychological adjustment, cognitive rehabilitation, and family-centred support." },
  { i:"TB", name:"Tom Bradley",         role:"Hydrotherapy Lead",          dept:"Physiotherapy",     dC:"#1a5a7a", bio:"Qualified physiotherapist and hydrotherapist with extensive neurological and musculoskeletal experience." },
  { i:"YT", name:"Yuki Tanaka",         role:"RehabHub Lead",              dept:"Robotics",          dC:"#7a6020", bio:"Expert operator of Fourier Intelligence systems, combining data-driven insights with hands-on clinical care." },
];
const marqueeTags = ["Neurophysiotherapy","Occupational Therapy","Speech & Language","Neuropsychology","Specialist Nursing","Hydrotherapy","RehabHub Robotics","Stroke Rehabilitation","Brain Injury","Spinal Cord Injury","Parkinson's","Multiple Sclerosis"];
const companyInfo = {
  phone: "+44 (203) 212 0839",
  email: "info@ascotrehab.com",
  location: "Streatham, London",
  pathways: "Inpatient, Outpatient and Outreach therapy services",
};
const feedbackConfig = {
  shortUrl: "ascotrehab.com/feedback",
  formUrl: "https://www.ascotrehab.com/contact-us/",
  endpoint: "",
};

/* ─── SUB-COMPONENTS ─── */
function Clock() {
  const [t, sT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => sT(new Date()), 1000); return () => clearInterval(id); }, []);
  const h = t.getHours().toString().padStart(2,"0");
  const m = t.getMinutes().toString().padStart(2,"0");
  const d = t.toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" });
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:700, letterSpacing:3, color:"var(--plum)" }}>
        {h}<span style={{ animation:"pulse 1.2s ease-in-out infinite", display:"inline-block" }}>:</span>{m}
      </div>
      <div style={{ fontSize:9, color:"var(--mu)", letterSpacing:2.5, textTransform:"uppercase", marginTop:1 }}>{d}</div>
    </div>
  );
}

function Eyebrow({ children, light }) {
  return <div className={`eyebrow${light?" lt":""}`}>{children}</div>;
}

function Stars({ n=5 }) {
  return <div style={{ color:"#e8a020", fontSize:13, letterSpacing:1 }}>{"★".repeat(n)}</div>;
}

function SHdr({ eye, title, light }) {
  return (
    <div style={{ marginBottom:18 }}>
      <Eyebrow light={light}>{eye}</Eyebrow>
      <h2 className="sh" style={light ? { color:"#fff" } : {}}>{title}</h2>
    </div>
  );
}

/* ─── MAIN ─── */
export default function App() {
  const [sec, setSec]   = useState("home");
  const [idx, setIdx]   = useState(0);
  const [key, setKey]   = useState(0);
  const [card, setCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    overall: "5",
    communication: "5",
    facility: "5",
    waitTime: "5",
    comment: "",
    consent: false,
  });
  const idle = useRef(null), slid = useRef(null);

  const go = (s) => { setSec(s); setCard(null); };
  const bump = () => {
    clearTimeout(idle.current);
    idle.current = setTimeout(() => { go("home"); setIdx(0); setKey(k=>k+1); }, 90000);
  };
  useEffect(() => {
    bump();
    window.addEventListener("click", bump);
    window.addEventListener("touchstart", bump);
    return () => { window.removeEventListener("click", bump); window.removeEventListener("touchstart", bump); clearTimeout(idle.current); };
  }, []);
  useEffect(() => {
    if (sec !== "home") return;
    slid.current = setInterval(() => { setIdx(i => (i+1) % heroSlides.length); setKey(k => k+1); }, 6000);
    return () => clearInterval(slid.current);
  }, [sec]);

  const sl = heroSlides[idx];
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(feedbackConfig.formUrl)}`;
  const onForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const submitFeedback = async (e) => {
    e.preventDefault();
    setErr("");
    setSent(false);
    if (!form.consent) {
      setErr("Please confirm consent before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        submittedAt: new Date().toISOString(),
        source: "front-display",
      };
      const existing = JSON.parse(localStorage.getItem("ascotPrivateFeedback") || "[]");
      localStorage.setItem("ascotPrivateFeedback", JSON.stringify([payload, ...existing].slice(0, 1000)));
      if (feedbackConfig.endpoint) {
        await fetch(feedbackConfig.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setSent(true);
      setForm({ overall: "5", communication: "5", facility: "5", waitTime: "5", comment: "", consent: false });
    } catch (error) {
      setErr("Unable to submit right now. Please scan the QR code to send feedback on your phone.");
    } finally {
      setSubmitting(false);
    }
  };
  const nav = [
    { id:"home",       label:"Home",       sym:"⊹" },
    { id:"services",   label:"Services",   sym:"⊕" },
    { id:"conditions", label:"Conditions", sym:"⊗" },
    { id:"reviews",    label:"Reviews",    sym:"★" },
    { id:"feedback",   label:"Feedback",   sym:"✎" },
    { id:"team",       label:"Our Team",   sym:"⊘" },
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily:"var(--font)", background:"var(--ws)", width:"100vw", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden", color:"var(--tx)" }}>

        {/* Subtle background orbs */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
          <div className="orb-a" style={{ position:"absolute", top:"-20%", right:"-8%", width:"45vw", height:"45vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(97,33,65,0.06) 0%,transparent 70%)" }}/>
          <div className="orb-b" style={{ position:"absolute", bottom:"-15%", left:"-6%", width:"38vw", height:"38vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(131,120,111,0.07) 0%,transparent 70%)" }}/>
        </div>

        {/* ── HEADER ── */}
        <header style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 36px", borderBottom:"1.5px solid var(--bd)", background:"rgba(255,255,255,0.9)", backdropFilter:"blur(16px)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:13 }}>
            {/* Logo mark matching website */}
            <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--plum)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff", letterSpacing:-0.5 }}>A</div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, letterSpacing:-.3, color:"var(--plum)" }}>Ascot Rehab</div>
              <div style={{ fontSize:9, color:"var(--mu)", letterSpacing:2, textTransform:"uppercase", marginTop:1 }}>Neurorehabilitation · South West London</div>
            </div>
          </div>
          <Clock />
          {/* Accreditation badge — from website */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ padding:"5px 14px", borderRadius:100, border:"1.5px solid var(--bd)", fontSize:10, fontWeight:600, color:"var(--warm)", letterSpacing:.15, textTransform:"uppercase" }}>Fourier Centre of Excellence</div>
            <div style={{ padding:"5px 14px", borderRadius:100, background:"var(--plum)", fontSize:10, fontWeight:600, color:"#fff", letterSpacing:.15, textTransform:"uppercase" }}>★★★★★ Rated</div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ flex:1, overflow:"hidden", position:"relative", zIndex:5 }}>

          {/* ── HOME ── */}
          {sec === "home" && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"var(--pp)", position:"relative", overflow:"hidden" }} key={key}>
              {/* Background texture */}
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 80% at -5% 55%,rgba(97,33,65,.6) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 105% 5%,rgba(131,120,111,.1) 0%,transparent 55%)", pointerEvents:"none" }}/>

              {/* Hero content */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"40px 64px 20px", position:"relative", zIndex:2, maxWidth:760 }}>
                <Eyebrow light>{sl.eye}</Eyebrow>
                <h1 className="fade-up" style={{ fontFamily:"var(--font)", fontSize:"clamp(40px,6vw,80px)", fontWeight:800, lineHeight:1.0, letterSpacing:-2, whiteSpace:"pre-line", color:"#fff", marginBottom:18, marginTop:8 }}>{sl.h}</h1>
                <p className="fade-up-2" style={{ fontSize:15, color:"rgba(255,255,255,0.6)", lineHeight:1.75, fontWeight:300, maxWidth:420 }}>{sl.b}</p>

                {/* Slide dots */}
                <div className="fade-up-3" style={{ display:"flex", gap:7, marginTop:28 }}>
                  {heroSlides.map((_,i) => (
                    <button key={i} onClick={() => { setIdx(i); setKey(k=>k+1); }}
                      style={{ width:i===idx?22:7, height:7, borderRadius:4, background:i===idx?"#fff":"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.35s ease", padding:0 }}/>
                  ))}
                </div>
              </div>

              {/* Stats bar — matches website stat row */}
              <div style={{ position:"relative", zIndex:2, display:"flex", borderTop:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.2)", backdropFilter:"blur(8px)" }}>
                {stats.map((s,i) => (
                  <div key={i} className="stat-in" style={{ flex:1, padding:"20px 28px", borderRight:i<stats.length-1?"1px solid rgba(255,255,255,0.1)":"none", animationDelay:`${i*0.07}s` }}>
                    <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:-1, lineHeight:1 }}>{s.n}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:4, letterSpacing:1.5, textTransform:"uppercase", fontWeight:500 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Marquee ticker — from website */}
              <div style={{ background:"var(--plum)", padding:"11px 0", overflow:"hidden", flexShrink:0, position:"relative", zIndex:2 }}>
                <div className="marquee-track" style={{ gap:0 }}>
                  {[...marqueeTags,...marqueeTags].map((t,i) => (
                    <span key={i} style={{ whiteSpace:"nowrap", padding:"0 24px", fontSize:11, fontWeight:600, letterSpacing:.18, textTransform:"uppercase", color:"rgba(255,255,255,0.7)", borderRight:"1px solid rgba(255,255,255,0.15)", flexShrink:0 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:20, background:"#fff", padding:"12px 22px", borderTop:"1px solid var(--bd)" }}>
                <div style={{ fontSize:11, color:"var(--tm)", letterSpacing:0.2 }}>
                  Share your private session feedback via touchscreen or scan QR on the feedback screen.
                </div>
                <button onClick={() => go("feedback")} style={{ border:"none", background:"var(--plum)", color:"#fff", fontWeight:600, borderRadius:999, padding:"8px 14px", cursor:"pointer" }}>
                  Leave feedback
                </button>
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {sec === "services" && (
            <div className="sec-in scroll" style={{ height:"100%", padding:"24px 36px" }}>
              <SHdr eye="What we offer" title="Our Services" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
                {services.map((s,i) => (
                  <button key={i} className={`card ${card===i?"on":""}`} onClick={() => setCard(card===i?null:i)}
                    style={{ padding:"18px 20px", textAlign:"left", border:"none", display:"block", width:"100%", color:"inherit" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <span style={{ fontSize:10, fontWeight:600, letterSpacing:2, color:card===i?"rgba(255,255,255,0.3)":"var(--mu)" }}>{s.n}</span>
                      <span className="tag-pill" style={{ background:card===i?"rgba(255,255,255,0.15)":s.tagBg, color:card===i?"rgba(255,255,255,0.8)":s.tagC }}>{s.tag}</span>
                    </div>
                    <div style={{ fontSize:17, fontWeight:700, letterSpacing:-.3, color:card===i?"#fff":"var(--pd)", marginBottom:6, lineHeight:1.2 }}>{s.title}</div>
                    {card===i
                      ? <p style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.72, fontWeight:300 }}>{s.desc}</p>
                      : <span style={{ fontSize:11, color:"var(--wl)" }}>Tap for details →</span>
                    }
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CONDITIONS ── */}
          {sec === "conditions" && (
            <div className="sec-in scroll" style={{ height:"100%", padding:"24px 36px" }}>
              <SHdr eye="We specialise in" title="Conditions We Treat" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:11 }}>
                {conditions.map((c,i) => (
                  <button key={i} className={`card ${card===i?"on":""}`} onClick={() => setCard(card===i?null:i)}
                    style={{ padding:"20px 22px", textAlign:"left", border:"none", display:"flex", gap:16, alignItems:"flex-start", width:"100%", color:"inherit" }}>
                    {/* Accent dot */}
                    <div style={{ width:10, height:10, borderRadius:"50%", background:card===i?"rgba(255,255,255,0.5)":c.acc, flexShrink:0, marginTop:6, boxShadow:card===i?"none":`0 0 0 3px ${c.acc}22`, transition:"all 0.3s" }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:17, fontWeight:700, letterSpacing:-.3, color:card===i?"#fff":"var(--pd)", marginBottom:5, lineHeight:1.2 }}>{c.title}</div>
                      {card===i
                        ? <p style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.72, fontWeight:300 }}>{c.desc}</p>
                        : <span style={{ fontSize:11, color:"var(--wl)" }}>Tap to learn more →</span>
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── REVIEWS — real Google reviews from website ── */}
          {sec === "reviews" && (
            <div className="sec-in scroll" style={{ height:"100%", padding:"24px 36px" }}>
              {/* Rating banner — matches website */}
              <div style={{ background:"var(--plum)", borderRadius:16, padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <div>
                  <Eyebrow light>Patient Voices</Eyebrow>
                  <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:-.5, marginTop:4 }}>What Our Patients Say</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <Stars n={5}/>
                  <div style={{ fontSize:32, fontWeight:800, color:"#fff", letterSpacing:-1, lineHeight:1, marginTop:4 }}>5.0</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>Based on Google Reviews</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:11 }}>
                {reviews.map((r,i) => (
                  <div key={i} className="r-card">
                    <Stars n={r.stars}/>
                    <p style={{ fontSize:13.5, color:"var(--tm)", lineHeight:1.72, fontWeight:400, margin:"10px 0 14px", fontStyle:"italic" }}>"{r.text}"</p>
                    <div style={{ fontSize:12, fontWeight:600, color:"var(--pd)" }}>{r.author}</div>
                    <div style={{ fontSize:10, color:"var(--wl)", letterSpacing:.5, marginTop:2 }}>{r.source}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TEAM ── */}
          {sec === "team" && (
            <div className="sec-in scroll" style={{ height:"100%", padding:"24px 36px" }}>
              <SHdr eye="The people behind your care" title="Meet Our Team" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
                {team.map((m,i) => (
                  <button key={i} className={`card ${card===i?"on":""}`} onClick={() => setCard(card===i?null:i)}
                    style={{ padding:"18px 18px", textAlign:"left", border:"none", display:"block", width:"100%", color:"inherit" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:11 }}>
                      <div style={{ width:42, height:42, borderRadius:"50%", flexShrink:0, background:card===i?"rgba(255,255,255,0.15)":`${m.dC}18`, border:`1.5px solid ${card===i?"rgba(255,255,255,0.3)":m.dC+"40"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:card===i?"#fff":m.dC, transition:"all 0.3s" }}>{m.i}</div>
                      <span className="tag-pill" style={{ background:card===i?"rgba(255,255,255,0.15)":`${m.dC}14`, color:card===i?"rgba(255,255,255,0.8)":m.dC }}>{m.dept}</span>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700, letterSpacing:-.3, color:card===i?"#fff":"var(--pd)", marginBottom:2 }}>{m.name}</div>
                    <div style={{ fontSize:11, color:card===i?"rgba(255,255,255,0.5)":"var(--wl)", marginBottom:card===i?10:0 }}>{m.role}</div>
                    {card===i && <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.68)", lineHeight:1.7, fontWeight:300, borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:10 }}>{m.bio}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {sec === "feedback" && (
            <div className="sec-in scroll" style={{ height:"100%", padding:"24px 36px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.15fr 1fr", gap:14 }}>
                <div style={{ background:"#fff", border:"1.5px solid var(--bd)", borderRadius:16, padding:"20px 22px" }}>
                  <SHdr eye="Private quality feedback" title="After Your Session" />
                  <p style={{ fontSize:13, color:"var(--tm)", lineHeight:1.7, marginBottom:14 }}>
                    This feedback is private and reviewed by the Ascot Rehab team to improve service quality. We avoid collecting sensitive medical details on this kiosk form.
                  </p>
                  <form onSubmit={submitFeedback} style={{ display:"grid", gap:10 }}>
                    {[
                      ["overall", "Overall experience"],
                      ["communication", "Therapist communication"],
                      ["facility", "Facility comfort and cleanliness"],
                      ["waitTime", "Wait time and scheduling"],
                    ].map(([field, label]) => (
                      <label key={field} style={{ display:"grid", gap:4, fontSize:12, color:"var(--pd)", fontWeight:600 }}>
                        {label}
                        <select value={form[field]} onChange={(e) => onForm(field, e.target.value)} style={{ border:"1px solid var(--bd)", borderRadius:10, padding:"9px 10px", fontFamily:"var(--font)", color:"var(--tm)" }}>
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Fair</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Very poor</option>
                        </select>
                      </label>
                    ))}
                    <label style={{ display:"grid", gap:4, fontSize:12, color:"var(--pd)", fontWeight:600 }}>
                      Additional comments (optional)
                      <textarea value={form.comment} onChange={(e) => onForm("comment", e.target.value)} rows={4} maxLength={450} placeholder="Tell us what worked well and what we can improve." style={{ border:"1px solid var(--bd)", borderRadius:10, padding:"9px 10px", resize:"vertical", fontFamily:"var(--font)", color:"var(--tm)" }} />
                    </label>
                    <label style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:11, color:"var(--tm)", lineHeight:1.5 }}>
                      <input type="checkbox" checked={form.consent} onChange={(e) => onForm("consent", e.target.checked)} style={{ marginTop:2 }} />
                      I consent to Ascot Rehab storing this response as private service feedback.
                    </label>
                    {err && <div style={{ fontSize:11, color:"#9e2742" }}>{err}</div>}
                    {sent && <div style={{ fontSize:11, color:"#1a6a4a" }}>Thank you. Your feedback was sent to Ascot Rehab's private quality review inbox.</div>}
                    <button type="submit" disabled={submitting} style={{ border:"none", background:"var(--plum)", color:"#fff", borderRadius:10, padding:"10px 12px", fontWeight:600, cursor:"pointer", opacity:submitting ? 0.8 : 1 }}>
                      {submitting ? "Submitting..." : "Submit private feedback"}
                    </button>
                  </form>
                </div>
                <div style={{ display:"grid", gap:12, alignContent:"start" }}>
                  <div style={{ background:"#fff", border:"1.5px solid var(--bd)", borderRadius:16, padding:"18px", textAlign:"center" }}>
                    <Eyebrow>Prefer your phone?</Eyebrow>
                    <div style={{ fontSize:21, color:"var(--pd)", fontWeight:700, letterSpacing:-0.5, marginBottom:8 }}>Scan to leave feedback</div>
                    <img alt="QR code for Ascot private feedback form" src={qrImage} width="170" height="170" style={{ borderRadius:8, border:"1px solid var(--bd)", padding:6, background:"#fff" }} />
                    <div style={{ fontSize:11, color:"var(--tm)", marginTop:8 }}>{feedbackConfig.shortUrl}</div>
                    <div style={{ fontSize:10, color:"var(--wl)", marginTop:4 }}>Uses Ascot's secure website contact form.</div>
                  </div>
                  <div style={{ background:"var(--pp)", borderRadius:16, padding:"16px 18px", color:"#fff" }}>
                    <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:1.4, color:"rgba(255,255,255,0.65)" }}>Contact & pathways</div>
                    <div style={{ marginTop:8, fontSize:13, color:"rgba(255,255,255,0.85)" }}>{companyInfo.pathways}</div>
                    <div style={{ marginTop:8, fontSize:12 }}>{companyInfo.phone}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>{companyInfo.email}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:6 }}>{companyInfo.location}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── BOTTOM NAV ── */}
        <nav style={{ position:"relative", zIndex:10, display:"flex", justifyContent:"center", padding:"11px 36px 14px", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)", borderTop:"1.5px solid var(--bd)", gap:7, flexShrink:0 }}>
          {nav.map(n => (
            <button key={n.id} className={`nav-btn ${sec===n.id?"on":""}`} onClick={() => go(n.id)}
              style={{ padding:"8px 22px", border:`1.5px solid ${sec===n.id?"var(--plum)":"var(--bd)"}`, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", gap:7, color:sec===n.id?"#fff":"var(--wl)" }}>
              <span style={{ fontSize:12 }}>{n.sym}</span>
              <span style={{ fontSize:11, letterSpacing:1.5, textTransform:"uppercase", fontWeight:sec===n.id?600:400 }}>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
