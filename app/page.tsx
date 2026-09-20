export default function Home() {
  return (
    <main className="av-main fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span>
        </div>
      </section>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <button className="btn pulse">JUGAR AHORA</button>
      </div>
    </main>
  );
}
