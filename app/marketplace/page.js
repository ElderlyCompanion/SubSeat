'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const P  = "#563BE7";
const L  = "#E9E6FF";
const C  = "#171717";
const G  = "#F4F4F4";
const W  = "#ffffff";
const RED = "#e53e3e";

const CATS = [
  "Barber Chairs","Salon Furniture","Clippers & Tools",
  "Hair Products","Nail Equipment","Skincare Products",
  "Mirrors & Lighting","Shop Fittings","Other Equipment",
];
const CONDITIONS  = ["New","Like New","Good","Fair","Spares / Repairs"];
const DELIVERY    = [
  "Collection only",
  "Seller can deliver locally",
  "Buyer arranges courier",
  "Seller can post item",
];

const fmt = n => `£${Number(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Poppins',sans-serif;background:#fafafa;color:${C};overflow-x:hidden}

  @keyframes fadeUp {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin   {to{transform:rotate(360deg)}}
  @keyframes pulse  {0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

  .fu {animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
  .d1 {animation-delay:.08s} .d2{animation-delay:.16s} .d3{animation-delay:.24s}

  .inp{
    width:100%;padding:13px 16px;border-radius:12px;
    border:1.5px solid #e0e0e0;background:${W};
    font-family:'Poppins',sans-serif;font-size:15px;color:${C};
    outline:none;transition:border-color .2s;min-height:48px;
  }
  .inp:focus{border-color:${P};box-shadow:0 0 0 3px rgba(86,59,231,.08)}
  .inp::placeholder{color:#bbb}
  select.inp{cursor:pointer}
  textarea.inp{min-height:110px;resize:vertical}

  .btn-p{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:${P};color:${W};border:none;padding:14px 28px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;
    cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(86,59,231,.3);
  }
  .btn-p:hover{background:#4429d4;transform:translateY(-2px)}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}

  .btn-s{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:transparent;color:${P};border:2px solid ${P};
    padding:12px 24px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:14px;
    cursor:pointer;transition:all .2s;
  }
  .btn-s:hover{background:${L}}

  /* LISTING CARD */
  .listing-card{
    background:${W};border-radius:20px;overflow:hidden;
    border:1.5px solid #eee;transition:all .22s;cursor:pointer;
  }
  .listing-card:hover{border-color:${P};transform:translateY(-4px);box-shadow:0 16px 48px rgba(86,59,231,.12)}

  /* SOLD RIBBON */
  .sold-ribbon{
    position:absolute;top:14px;right:-28px;
    background:${RED};color:${W};font-weight:800;font-size:12px;
    padding:5px 36px;transform:rotate(45deg);
    letter-spacing:1px;box-shadow:0 2px 8px rgba(0,0,0,.2);
    z-index:10;
  }

  /* FILTER PILL */
  .pill{
    padding:8px 18px;border-radius:100px;border:1.5px solid #eee;
    background:${W};font-family:'Poppins',sans-serif;font-weight:600;
    font-size:13px;cursor:pointer;transition:all .18s;color:#888;
    white-space:nowrap;
  }
  .pill.active{background:${P};color:${W};border-color:${P}}
  .pill:hover{border-color:${P};color:${P}}

  /* MODAL */
  .modal-bg{
    position:fixed;inset:0;background:rgba(0,0,0,.7);
    z-index:999;backdrop-filter:blur(6px);
    display:flex;align-items:flex-end;justify-content:center;
    padding:16px;
  }
  @media(min-width:600px){
    .modal-bg{align-items:center}
    .modal-box{max-height:90vh;border-radius:24px !important}
  }
  .modal-box{
    background:${W};border-radius:24px 24px 0 0;
    width:100%;max-width:640px;
    max-height:95vh;overflow-y:auto;
    padding:28px 24px 40px;
    animation:slideUp .3s cubic-bezier(.22,1,.36,1);
  }
  .modal-handle{
    width:40px;height:4px;border-radius:4px;
    background:#e0e0e0;margin:0 auto 20px;
  }

  /* UPLOAD ZONE */
  .upload-zone{
    border:2px dashed #e0e0e0;border-radius:14px;
    padding:28px;text-align:center;cursor:pointer;
    transition:all .2s;
  }
  .upload-zone:hover{border-color:${P};background:${L}20}

  /* GRID */
  .listings-grid{
    display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:20px;
  }

  @media(max-width:600px){
    .listings-grid{grid-template-columns:1fr 1fr !important;gap:12px !important}
    .form-two{grid-template-columns:1fr !important}
    .hero-btns{flex-direction:column !important;align-items:stretch !important}
  }
  @media(max-width:400px){
    .listings-grid{grid-template-columns:1fr !important}
  }
`;

/* ── IMAGE UPLOAD ── */
async function uploadMarketplaceImage(file, listingId) {
  const ext  = file.name.split(".").pop();
  const path = `${listingId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("marketplace-images")
    .upload(path, file, { upsert:true, contentType:file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("marketplace-images").getPublicUrl(path);
  return data.publicUrl;
}

/* ── LISTING CARD ── */
function ListingCard({ listing, onClick }) {
  const isSold    = listing.status === "sold";
  const isExpired = listing.status === "expired";
  const img       = listing.photo_urls?.[0];
  const fee       = listing.price * 0.01;
  const buyerPays = listing.price;

  return (
    <div className="listing-card" onClick={onClick} style={{ opacity:isExpired?.6:1 }}>
      {/* IMAGE */}
      <div style={{ position:"relative", height:200, background:G, overflow:"hidden" }}>
        {img
          ? <img src={img} alt={listing.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>🛍️</div>
        }
        {/* SOLD RIBBON */}
        {isSold && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.45)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            <div className="sold-ribbon">SOLD</div>
          </div>
        )}
        {/* CONDITION BADGE */}
        {!isSold && (
          <div style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,.65)", color:W, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
            {listing.condition}
          </div>
        )}
        {/* DELIVERY BADGE */}
        {!isSold && listing.delivery_option && (
          <div style={{ position:"absolute", bottom:10, left:10, background:P, color:W, borderRadius:100, padding:"3px 10px", fontSize:10, fontWeight:700 }}>
            {listing.delivery_option === "Collection only" ? "📍 Collection" : listing.delivery_option === "Seller can post item" ? "📦 Post" : listing.delivery_option === "Buyer arranges courier" ? "🚚 Courier" : "🚐 Local delivery"}
          </div>
        )}
      </div>

      {/* INFO */}
      <div style={{ padding:"16px 18px" }}>
        <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4, lineHeight:1.3, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{listing.title}</div>
        <div style={{ fontSize:12, color:"#888", marginBottom:10 }}>{listing.seller_business_name || "SubSeat Seller"} · {listing.postcode}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:900, fontSize:20, color:isSold?"#aaa":P }}>{fmt(buyerPays)}</div>
          {!isSold && <div style={{ fontSize:11, color:"#aaa" }}>{listing.category}</div>}
          {isSold && <span style={{ background:"#fee2e2", color:RED, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>Sold</span>}
        </div>
      </div>
    </div>
  );
}

/* ── LISTING DETAIL MODAL ── */
function ListingModal({ listing, onClose, onBuy, user, onMarkSold }) {
  const [imgIdx,    setImgIdx]    = useState(0);
  const [buyStep,   setBuyStep]   = useState(false);
  const [buyForm,   setBuyForm]   = useState({ name:"", email:"", phone:"" });
  const [buying,    setBuying]    = useState(false);
  const [bought,    setBought]    = useState(false);
  const [buyError,  setBuyError]  = useState("");
  const isSold    = listing.status === "sold";
  const isOwner   = user?.id === listing.seller_user_id;
  const photos    = listing.photo_urls || [];
  const fee       = Math.round(listing.price * 0.01 * 100) / 100;
  const sellerGets = Math.round((listing.price - fee) * 100) / 100;

  const handleBuy = async () => {
    if (!buyForm.name || !buyForm.email || !buyForm.phone) { setBuyError("Please fill in all fields."); return; }
    setBuying(true); setBuyError("");
    try {
      // Create order
      const { error } = await supabase.from("marketplace_orders").insert({
        listing_id:       listing.id,
        buyer_user_id:    user?.id || null,
        buyer_name:       buyForm.name,
        buyer_email:      buyForm.email,
        buyer_phone:      buyForm.phone,
        amount:           listing.price,
        platform_fee:     fee,
        seller_amount:    sellerGets,
        stripe_payment_id:"pending_stripe",
        status:           "paid",
      });
      if (error) throw error;

      // Mark listing as sold
      await supabase.from("marketplace_listings").update({ status:"sold" }).eq("id", listing.id);

      // Send notification emails
      await fetch("/api/marketplace-purchase", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          listing,
          buyer: buyForm,
          fee, sellerGets,
        }),
      });

      setBought(true);
      onBuy?.();
    } catch(err) {
      console.error(err);
      setBuyError("Something went wrong. Please try again.");
    }
    setBuying(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle" />

        {bought ? (
          /* SUCCESS */
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h3 style={{ fontWeight:900, fontSize:22, color:C, marginBottom:10 }}>Purchase Complete!</h3>
            <p style={{ fontSize:14, color:"#666", lineHeight:1.7, marginBottom:8 }}>
              Thanks for your purchase. The seller has been notified and will contact you to arrange collection or delivery.
            </p>
            <div style={{ background:G, borderRadius:14, padding:"16px 20px", margin:"20px 0", textAlign:"left" }}>
              <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4 }}>{listing.title}</div>
              <div style={{ fontSize:13, color:"#888" }}>Seller: {listing.seller_business_name}</div>
              <div style={{ fontSize:13, color:"#888" }}>Contact: {listing.seller_phone}</div>
            </div>
            <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:12, padding:"12px 16px", fontSize:12, color:"#92400e", marginBottom:20, textAlign:"left" }}>
              SubSeat connects buyers and sellers. Delivery, collection, condition and handover are agreed directly between buyer and seller.
            </div>
            <button className="btn-p" onClick={onClose} style={{ width:"100%" }}>Close</button>
          </div>
        ) : (
          <>
            {/* PHOTOS */}
            {photos.length > 0 && (
              <div style={{ position:"relative", borderRadius:16, overflow:"hidden", marginBottom:20, height:260 }}>
                <img src={photos[imgIdx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                {isSold && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                    <div className="sold-ribbon" style={{ fontSize:18, padding:"8px 48px" }}>SOLD</div>
                  </div>
                )}
                {photos.length > 1 && (
                  <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:6 }}>
                    {photos.map((_,i) => (
                      <button key={i} onClick={e=>{e.stopPropagation();setImgIdx(i);}}
                        style={{ width:8, height:8, borderRadius:"50%", border:"none", background:i===imgIdx?W:"rgba(255,255,255,.5)", cursor:"pointer", padding:0 }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DETAILS */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:12 }}>
              <h2 style={{ fontWeight:800, fontSize:20, color:C, lineHeight:1.3 }}>{listing.title}</h2>
              <div style={{ fontWeight:900, fontSize:24, color:P, flexShrink:0 }}>{fmt(listing.price)}</div>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
              <span style={{ background:L, color:P, borderRadius:100, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{listing.condition}</span>
              <span style={{ background:G, color:"#666", borderRadius:100, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{listing.category}</span>
              {listing.delivery_option && (
                <span style={{ background:G, color:"#666", borderRadius:100, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{listing.delivery_option}</span>
              )}
            </div>

            {listing.description && (
              <p style={{ fontSize:14, color:"#555", lineHeight:1.75, marginBottom:16 }}>{listing.description}</p>
            )}

            <div style={{ background:G, borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontWeight:700, fontSize:13, color:C, marginBottom:6 }}>Seller</div>
              <div style={{ fontSize:13, color:"#555" }}>{listing.seller_business_name}</div>
              {listing.postcode && <div style={{ fontSize:12, color:"#888", marginTop:2 }}>📍 {listing.postcode}</div>}
            </div>

            {/* FEE BREAKDOWN */}
            {!isSold && !isOwner && (
              <div style={{ background:L, borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:"#666" }}>Item price</span>
                  <span style={{ fontSize:13, fontWeight:700, color:C }}>{fmt(listing.price)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:"#666" }}>SubSeat fee (1%)</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#888" }}>{fmt(fee)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid rgba(86,59,231,.15)" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C }}>Total you pay</span>
                  <span style={{ fontSize:16, fontWeight:900, color:P }}>{fmt(listing.price)}</span>
                </div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:8 }}>Seller receives {fmt(sellerGets)} after SubSeat's 1% marketplace fee.</div>
              </div>
            )}

            {/* DISCLAIMER */}
            <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"11px 14px", fontSize:12, color:"#92400e", lineHeight:1.55, marginBottom:20 }}>
              SubSeat connects buyers and sellers. Delivery, collection, condition and handover are agreed directly between buyer and seller. SubSeat is not liable for the condition or delivery of items.
            </div>

            {/* ACTIONS */}
            {isSold && (
              <div style={{ background:"#fee2e2", borderRadius:12, padding:"16px", textAlign:"center", fontWeight:700, fontSize:15, color:RED }}>
                This item has been sold
              </div>
            )}

            {!isSold && isOwner && (
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-s" onClick={()=>onMarkSold(listing.id)} style={{ flex:1 }}>Mark as Sold</button>
                <button className="btn-p" onClick={onClose} style={{ flex:1 }}>Close</button>
              </div>
            )}

            {!isSold && !isOwner && !buyStep && (
              <button className="btn-p" onClick={()=>setBuyStep(true)} style={{ width:"100%" }}>
                Buy Now — {fmt(listing.price)}
              </button>
            )}

            {!isSold && !isOwner && buyStep && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <h3 style={{ fontWeight:700, fontSize:16, color:C }}>Your contact details</h3>
                <p style={{ fontSize:13, color:"#888", marginTop:-8 }}>The seller will use these to arrange collection or delivery.</p>
                {[
                  { label:"Your Name *",    key:"name",  type:"text",  ph:"Jordan Smith"   },
                  { label:"Email *",        key:"email", type:"email", ph:"your@email.com" },
                  { label:"Phone *",        key:"phone", type:"tel",   ph:"07700 000000"   },
                ].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>{f.label}</label>
                    <input className="inp" type={f.type} placeholder={f.ph} value={buyForm[f.key]} onChange={e=>setBuyForm({...buyForm,[f.key]:e.target.value})} />
                  </div>
                ))}
                {buyError && <div style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:10, padding:"10px 14px", fontSize:13, color:RED, fontWeight:600 }}>{buyError}</div>}
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn-s" onClick={()=>setBuyStep(false)} style={{ flex:1 }}>← Back</button>
                  <button className="btn-p" onClick={handleBuy} disabled={buying} style={{ flex:2 }}>
                    {buying ? "Processing..." : `Confirm Purchase — ${fmt(listing.price)}`}
                  </button>
                </div>
                <p style={{ fontSize:11, color:"#aaa", textAlign:"center" }}>
                  Stripe payment coming soon. Your order will be confirmed and seller notified.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── CREATE LISTING MODAL ── */
function CreateListingModal({ onClose, onCreated, user }) {
  const [form, setForm] = useState({
    title:"", description:"", price:"", category:"", condition:"",
    seller_business_name:"", seller_email:"", seller_phone:"",
    postcode:"", delivery_option:"",
  });
  const [photos,    setPhotos]    = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [step,      setStep]      = useState(1); // 1=details, 2=photos, 3=confirm

  const handlePhotoUpload = async (files) => {
    setUploading(true);
    const tempId = `temp-${Date.now()}`;
    const urls = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadMarketplaceImage(file, tempId);
        urls.push(url);
      } catch(e) { console.error(e); }
    }
    setPhotos(prev => [...prev, ...urls].slice(0,5));
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.title||!form.price||!form.category||!form.condition||!form.seller_email||!form.seller_phone) {
      setError("Please fill in all required fields."); return;
    }
    setSaving(true); setError("");
    try {
      const { error:dbErr } = await supabase.from("marketplace_listings").insert({
        ...form,
        price:        parseFloat(form.price),
        photo_urls:   photos,
        seller_user_id: user?.id || null,
        status:       "pending_approval",
      });
      if (dbErr) throw dbErr;

      // Notify admin
      await fetch("/api/marketplace-listing", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, photos }),
      });

      onCreated();
    } catch(err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:580 }} onClick={e=>e.stopPropagation()}>
        <div className="modal-handle" />

        {/* STEP INDICATOR */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:24 }}>
          {["Details","Photos","Confirm"].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:i+1<=step?P:"#eee", color:i+1<=step?W:"#aaa", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12 }}>
                {i+1<step?"✓":i+1}
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:i+1<=step?P:"#aaa" }}>{s}</span>
              {i<2 && <div style={{ width:20, height:2, background:i+1<step?P:"#eee" }} />}
            </div>
          ))}
        </div>

        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <h3 style={{ fontWeight:800, fontSize:18, color:C }}>List your item</h3>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Title *</label>
              <input className="inp" placeholder="e.g. Takara Belmont Barber Chair — excellent condition" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Description</label>
              <textarea className="inp" rows={3} placeholder="Describe the item, any defects, age, reason for selling..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
            </div>

            <div className="form-two" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Price (£) *</label>
                <input className="inp" type="number" placeholder="250" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Postcode *</label>
                <input className="inp" placeholder="E1 6RF" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value.toUpperCase()})} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Category *</label>
                <select className="inp" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="">Select category</option>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Condition *</label>
                <select className="inp" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
                  <option value="">Select condition</option>
                  {CONDITIONS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Delivery Option *</label>
              <select className="inp" value={form.delivery_option} onChange={e=>setForm({...form,delivery_option:e.target.value})}>
                <option value="">Select delivery option</option>
                {DELIVERY.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", paddingTop:8, borderTop:"1px solid #f0f0f0" }}>Your Contact Details</div>

            <div className="form-two" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Business Name</label>
                <input className="inp" placeholder="The Cut Lab" value={form.seller_business_name} onChange={e=>setForm({...form,seller_business_name:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Email *</label>
                <input className="inp" type="email" placeholder="your@email.com" value={form.seller_email} onChange={e=>setForm({...form,seller_email:e.target.value})} />
              </div>
              <div className="form-two" style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:5 }}>Phone *</label>
                <input className="inp" type="tel" placeholder="07700 000000" value={form.seller_phone} onChange={e=>setForm({...form,seller_phone:e.target.value})} />
              </div>
            </div>

            {error && <div style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:10, padding:"10px 14px", fontSize:13, color:RED, fontWeight:600 }}>{error}</div>}

            <button className="btn-p" onClick={()=>{
              if (!form.title||!form.price||!form.category||!form.condition||!form.seller_email||!form.seller_phone) { setError("Please fill in all required fields."); return; }
              setError(""); setStep(2);
            }} style={{ width:"100%" }}>
              Next — Add Photos →
            </button>
          </div>
        )}

        {step===2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h3 style={{ fontWeight:800, fontSize:18, color:C }}>Add photos</h3>
            <p style={{ fontSize:13, color:"#888", marginTop:-8 }}>Up to 5 photos. First photo is the cover image.</p>

            {/* UPLOAD ZONE */}
            <label className="upload-zone" style={{ display:"block" }}>
              <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e=>handlePhotoUpload(e.target.files)} />
              {uploading ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                  <div style={{ width:28, height:28, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
                  <span style={{ fontSize:13, color:P, fontWeight:600 }}>Uploading...</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:32, marginBottom:8 }}>📷</div>
                  <div style={{ fontWeight:700, fontSize:14, color:C, marginBottom:4 }}>Click to add photos</div>
                  <div style={{ fontSize:12, color:"#aaa" }}>JPG, PNG or WEBP · Max 5 photos</div>
                </div>
              )}
            </label>

            {/* PHOTO PREVIEWS */}
            {photos.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                {photos.map((url,i) => (
                  <div key={i} style={{ position:"relative", aspectRatio:"1", borderRadius:10, overflow:"hidden" }}>
                    <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    {i===0 && <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,.6)", fontSize:9, fontWeight:700, color:W, textAlign:"center", padding:"3px 0" }}>COVER</div>}
                    <button onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))}
                      style={{ position:"absolute", top:4, right:4, width:20, height:20, borderRadius:"50%", background:"rgba(0,0,0,.7)", color:W, border:"none", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"11px 14px", fontSize:12, color:"#92400e" }}>
              Photos help your listing sell faster. Make sure they clearly show the condition of the item.
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(1)} style={{ flex:1 }}>← Back</button>
              <button className="btn-p" onClick={()=>setStep(3)} style={{ flex:2 }}>Next — Review →</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h3 style={{ fontWeight:800, fontSize:18, color:C }}>Review your listing</h3>

            {photos[0] && <img src={photos[0]} alt="" style={{ width:"100%", height:200, objectFit:"cover", borderRadius:14 }} />}

            <div style={{ background:G, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ fontWeight:800, fontSize:17, color:C, marginBottom:6 }}>{form.title}</div>
              <div style={{ fontWeight:900, fontSize:22, color:P, marginBottom:8 }}>{form.price ? fmt(parseFloat(form.price)) : "£0.00"}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span style={{ background:L, color:P, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{form.condition}</span>
                <span style={{ background:"rgba(0,0,0,.06)", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#555" }}>{form.category}</span>
              </div>
              <div style={{ fontSize:12, color:"#888" }}>{form.delivery_option} · {form.postcode}</div>
            </div>

            <div style={{ background:L, borderRadius:12, padding:"12px 16px", fontSize:13, color:P, fontWeight:600 }}>
              Your listing will be reviewed by SubSeat before going live. This usually takes under 24 hours.
            </div>

            {error && <div style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:10, padding:"10px 14px", fontSize:13, color:RED, fontWeight:600 }}>{error}</div>}

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(2)} style={{ flex:1 }}>← Back</button>
              <button className="btn-p" onClick={handleSubmit} disabled={saving} style={{ flex:2 }}>
                {saving ? "Submitting..." : "Submit Listing →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SUBMITTED SUCCESS ── */
function ListingSubmitted({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:480, textAlign:"center" }} onClick={e=>e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C, marginBottom:10 }}>Listing submitted!</h3>
        <p style={{ fontSize:14, color:"#666", lineHeight:1.7, marginBottom:24 }}>
          Your listing is being reviewed by the SubSeat team. It will go live within 24 hours. You'll receive a confirmation email once approved.
        </p>
        <button className="btn-p" onClick={onClose} style={{ width:"100%" }}>Back to Marketplace</button>
      </div>
    </div>
  );
}

/* ── ROOT PAGE ── */
export default function MarketplacePage() {
  const [listings,     setListings]    = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [user,         setUser]        = useState(null);
  const [activeCat,    setActiveCat]   = useState("All");
  const [activeFilter, setActiveFilter]= useState("all"); // all | available | sold
  const [search,       setSearch]      = useState("");
  const [selected,     setSelected]    = useState(null);
  const [showCreate,   setShowCreate]  = useState(false);
  const [showSuccess,  setShowSuccess] = useState(false);
  const [sortBy,       setSortBy]      = useState("newest");

  useEffect(()=>{ loadListings(); getUser(); },[]);

  const getUser = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketplace_listings")
      .select("*")
      .in("status",["active","sold"])
      .order("created_at",{ ascending:false });
    setListings(data||[]);
    setLoading(false);
  };

  const handleMarkSold = async (id) => {
    await supabase.from("marketplace_listings").update({ status:"sold" }).eq("id",id);
    setSelected(null);
    loadListings();
  };

  // FILTER + SEARCH
  let filtered = listings
    .filter(l => activeCat==="All" || l.category===activeCat)
    .filter(l => activeFilter==="sold" ? l.status==="sold" : activeFilter==="available" ? l.status==="active" : true)
    .filter(l => !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.category?.toLowerCase().includes(search.toLowerCase()) || l.seller_business_name?.toLowerCase().includes(search.toLowerCase()));

  if (sortBy==="price-asc")  filtered = [...filtered].sort((a,b)=>a.price-b.price);
  if (sortBy==="price-desc") filtered = [...filtered].sort((a,b)=>b.price-a.price);

  const available = listings.filter(l=>l.status==="active").length;
  const sold      = listings.filter(l=>l.status==="sold").length;

  return (
    <>
      <style>{css}</style>

      {/* MODALS */}
      {selected && (
        <ListingModal
          listing={selected}
          user={user}
          onClose={()=>{ setSelected(null); loadListings(); }}
          onBuy={loadListings}
          onMarkSold={handleMarkSold}
        />
      )}
      {showCreate && !showSuccess && (
        <CreateListingModal
          user={user}
          onClose={()=>setShowCreate(false)}
          onCreated={()=>{ setShowCreate(false); setShowSuccess(true); loadListings(); }}
        />
      )}
      {showSuccess && <ListingSubmitted onClose={()=>setShowSuccess(false)} />}

      {/* NAV */}
      <nav style={{ background:"rgba(255,255,255,.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid #eee", padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-s" onClick={()=>setShowCreate(true)} style={{ fontSize:13, padding:"10px 18px" }}>+ Sell Item</button>
          <a href="/onboarding" style={{ background:P, color:W, textDecoration:"none", padding:"10px 20px", borderRadius:10, fontWeight:700, fontSize:13, fontFamily:"Poppins", display:"flex", alignItems:"center" }}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background:`linear-gradient(160deg,#0f0f1a 0%,#1a1040 50%,#0f0f1a 100%)`, padding:"72px 5% 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div className="fu" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(86,59,231,.25)", border:"1px solid rgba(86,59,231,.4)", borderRadius:100, padding:"7px 20px", fontSize:12, fontWeight:700, color:"#a78bfa", letterSpacing:1.5, textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite", display:"inline-block" }} />
            SubSeat Marketplace
          </div>
          <h1 className="fu d1" style={{ fontWeight:900, fontSize:"clamp(30px,5vw,58px)", color:W, letterSpacing:"-2px", lineHeight:1.06, marginBottom:16 }}>
            Buy and sell beauty<br/><span style={{ color:"#a78bfa" }}>& barber equipment.</span>
          </h1>
          <p className="fu d2" style={{ fontSize:"clamp(14px,1.7vw,17px)", color:"rgba(255,255,255,.6)", lineHeight:1.75, maxWidth:500, margin:"0 auto 32px" }}>
            Chairs, clippers, furniture and more — trusted by professionals across the UK. Only 1% platform fee.
          </p>
          <div className="fu d3 hero-btns" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-p" onClick={()=>setShowCreate(true)} style={{ fontSize:15 }}>+ List Your Item</button>
            <a href="#listings" style={{ background:"rgba(255,255,255,.1)", color:W, textDecoration:"none", padding:"14px 28px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:15, border:"1px solid rgba(255,255,255,.2)", display:"inline-flex", alignItems:"center" }}>
              Browse Listings
            </a>
          </div>

          {/* STATS */}
          <div className="fu" style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap", marginTop:36 }}>
            {[
              { val:available, label:"Items available" },
              { val:"1%",      label:"Platform fee"    },
              { val:sold,      label:"Items sold"      },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"12px 20px", textAlign:"center", minWidth:100 }}>
                <div style={{ fontWeight:900, fontSize:20, color:W }}>{s.val}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section id="listings" style={{ padding:"48px 5% 80px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>

          {/* SEARCH + SORT */}
          <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
            <input className="inp" placeholder="Search listings..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, minWidth:200 }} />
            <select className="inp" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width:"auto", minWidth:160 }}>
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* AVAILABILITY FILTER */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[{val:"all",label:`All (${listings.length})`},{val:"available",label:`Available (${available})`},{val:"sold",label:`Sold (${sold})`}].map(f=>(
              <button key={f.val} className={`pill ${activeFilter===f.val?"active":""}`} onClick={()=>setActiveFilter(f.val)}>{f.label}</button>
            ))}
          </div>

          {/* CATEGORY FILTERS */}
          <div style={{ display:"flex", gap:8, marginBottom:28, overflowX:"auto", paddingBottom:4, WebkitOverflowScrolling:"touch" }}>
            {["All",...CATS].map(cat=>(
              <button key={cat} className={`pill ${activeCat===cat?"active":""}`} onClick={()=>setActiveCat(cat)}>{cat}</button>
            ))}
          </div>

          {/* LISTINGS GRID */}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
              <div style={{ width:36, height:36, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🛍️</div>
              <h3 style={{ fontWeight:700, fontSize:20, color:C, marginBottom:8 }}>
                {listings.length===0 ? "No listings yet" : "No listings match your search"}
              </h3>
              <p style={{ fontSize:14, color:"#888", marginBottom:24 }}>
                {listings.length===0 ? "Be the first to list your equipment on SubSeat Marketplace." : "Try a different search or category."}
              </p>
              <button className="btn-p" onClick={()=>setShowCreate(true)}>+ List Your Item</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize:13, color:"#888", marginBottom:16 }}>{filtered.length} listing{filtered.length!==1?"s":""}</div>
              <div className="listings-grid">
                {filtered.map(l=>(
                  <ListingCard key={l.id} listing={l} onClick={()=>setSelected(l)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"60px 5%", background:G }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(22px,3vw,34px)", color:C, letterSpacing:"-1px", textAlign:"center", marginBottom:40 }}>How it works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:24 }}>
            {[
              { icon:"📋", title:"List your item",   body:"Fill in the details, upload photos and submit. We review and approve within 24 hours." },
              { icon:"🔍", title:"Buyer finds it",   body:"Buyers browse by category, location and price. Your listing reaches professionals across the UK." },
              { icon:"💳", title:"Sale confirmed",   body:"Buyer purchases securely. SubSeat takes just 1%. You receive the rest." },
              { icon:"🤝", title:"Arrange handover", body:"Buyer and seller agree collection or delivery directly. SubSeat sends both parties full contact details." },
            ].map((s,i)=>(
              <div key={i} style={{ background:W, borderRadius:18, padding:"24px 20px", border:"1.5px solid #eee" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:13, color:"#888", lineHeight:1.65 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"72px 5%", background:`linear-gradient(135deg,${P},#6d28d9)`, textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <h2 style={{ fontWeight:900, fontSize:"clamp(26px,4vw,44px)", color:W, letterSpacing:"-1.5px", marginBottom:14 }}>
            Got equipment to sell?
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.75)", marginBottom:32, lineHeight:1.7 }}>
            List your item in minutes. Only 1% platform fee. Reach thousands of beauty and barber professionals across the UK.
          </p>
          <button className="btn-p" onClick={()=>setShowCreate(true)} style={{ background:W, color:P, fontSize:16, padding:"16px 36px", boxShadow:"0 8px 24px rgba(0,0,0,.2)" }}>
            List Your Item Free →
          </button>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.45)", marginTop:14 }}>Free to list · Only 1% on sale · Admin approved</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:14 }}>
          {[["Home","/"],["Finance","/finance"],["About","/about"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.35)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.2)", maxWidth:560, margin:"0 auto", lineHeight:1.6 }}>
          SubSeat Marketplace connects buyers and sellers. SubSeat is not responsible for the condition, delivery or handover of items. All transactions between buyers and sellers are independent of SubSeat. SubSeat® is a UK registered trademark.
        </p>
      </footer>
    </>
  );
}