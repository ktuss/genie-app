import { useState, useEffect } from "react";

const WHATSAPP = "56921803882";

const defaultProducts = [
  {
    id: 1,
    name: "Dior Sauvage",
    price: 25000,
    img: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Invictus",
    price: 22000,
    img: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "212 VIP",
    price: 20000,
    img: "https://via.placeholder.com/150"
  }
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(defaultProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addToCart = (p) => {
    setCart([...cart, p]);
  };

  const sendWhatsApp = () => {
    const text = cart
      .map((p) => `- ${p.name} $${p.price}`)
      .join("\n");
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      "Hola, quiero estos productos:\n" + text
    )}`;
    window.open(url, "_blank");
  };

  // 🔹 HOME
  if (screen === "home") {
    return (
      <div style={styles.center}>
        <h1>🪔 Genie Scent</h1>
        <p>Haz clic para entrar</p>
        <button onClick={() => setScreen("menu")}>Entrar</button>
      </div>
    );
  }

  // 🔹 MENU
  if (screen === "menu") {
    return (
      <div style={styles.container}>
        <h2>Perfumes</h2>

        <button onClick={() => setScreen("admin")}>
          🔐 Administrador
        </button>

        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.img} width="100" />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Agregar</button>
          </div>
        ))}

        <button onClick={() => setScreen("cart")}>
          Ver carrito ({cart.length})
        </button>
      </div>
    );
  }

  // 🔹 CARRITO
  if (screen === "cart") {
    return (
      <div style={styles.container}>
        <h2>Carrito</h2>

        {cart.map((p, i) => (
          <p key={i}>
            {p.name} - ${p.price}
          </p>
        ))}

        <button onClick={sendWhatsApp}>
          Enviar por WhatsApp
        </button>

        <button onClick={() => setScreen("menu")}>
          Volver
        </button>
      </div>
    );
  }

  // 🔹 ADMIN LOGIN
  if (screen === "admin" && !admin) {
    let user = "";
    let pass = "";

    return (
      <div style={styles.center}>
        <h2>Admin</h2>
        <input placeholder="usuario" onChange={(e) => (user = e.target.value)} />
        <input placeholder="clave" type="password" onChange={(e) => (pass = e.target.value)} />
        <button
          onClick={() => {
            if (user === "admin" && pass === "1234") {
              setAdmin(true);
            } else {
              alert("Incorrecto");
            }
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  // 🔹 PANEL ADMIN
  if (screen === "admin" && admin) {
    const updateProduct = (index, field, value) => {
      const updated = [...products];
      updated[index][field] = value;
      setProducts(updated);
    };

    const addProduct = () => {
      setProducts([
        ...products,
        {
          id: Date.now(),
          name: "Nuevo",
          price: 0,
          img: "https://via.placeholder.com/150"
        }
      ]);
    };

    return (
      <div style={styles.container}>
        <h2>Panel Admin</h2>

        {products.map((p, i) => (
          <div key={p.id} style={styles.card}>
            <input
              value={p.name}
              onChange={(e) => updateProduct(i, "name", e.target.value)}
            />
            <input
              value={p.price}
              type="number"
              onChange={(e) => updateProduct(i, "price", e.target.value)}
            />
            <input
              value={p.img}
              onChange={(e) => updateProduct(i, "img", e.target.value)}
            />
          </div>
        ))}

        <button onClick={addProduct}>Agregar producto</button>
        <button onClick={() => setScreen("menu")}>Salir</button>
      </div>
    );
  }
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  },
  container: {
    padding: 20
  },
  card: {
    border: "1px solid #ccc",
    margin: 10,
    padding: 10
  }
};
