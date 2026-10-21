import { useState, useEffect, useRef, useCallback } from "react";
import { planets, PlanetData } from "./data/planets";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const planetPositionsRef = useRef<{ name: string; x: number; y: number; size: number }[]>([]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    drawStars(ctx, width, height);

    // Draw orbit paths
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    drawSun(ctx, centerX, centerY);

    // Draw planets
    const positions: { name: string; x: number; y: number; size: number }[] = [];
    planets.forEach((planet) => {
      // Calculate orbital angle based on time and orbital period
      const angularSpeed = (2 * Math.PI) / (planet.orbitalPeriod * 0.5);
      const angle = time * angularSpeed;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;

      positions.push({ name: planet.name, x, y, size: planet.size });

      // Draw planet
      drawPlanet(ctx, x, y, planet, planet.name === hoveredPlanet || planet.name === selectedPlanet?.name);
    });

    planetPositionsRef.current = positions;
  }, [hoveredPlanet, selectedPlanet]);

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Use a seeded random for consistent star positions
    const seed = 42;
    const pseudoRandom = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 200; i++) {
      const x = pseudoRandom(i) * width;
      const y = pseudoRandom(i + 1000) * height;
      const brightness = pseudoRandom(i + 2000) * 0.8 + 0.2;
      const size = pseudoRandom(i + 3000) * 1.5 + 0.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    }
  };

  const drawSun = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Sun glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
    gradient.addColorStop(0, "rgba(255, 200, 50, 1)");
    gradient.addColorStop(0.3, "rgba(255, 160, 20, 0.8)");
    gradient.addColorStop(0.6, "rgba(255, 100, 0, 0.3)");
    gradient.addColorStop(1, "rgba(255, 50, 0, 0)");

    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sun core
    const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
    coreGradient.addColorStop(0, "#fff8e0");
    coreGradient.addColorStop(0.5, "#ffcc00");
    coreGradient.addColorStop(1, "#ff8800");

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();
  };

  const drawPlanet = (ctx: CanvasRenderingContext2D, x: number, y: number, planet: PlanetData, isHighlighted: boolean) => {
    // Highlight glow
    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, planet.size + 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, planet.size + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Planet body
    const gradient = ctx.createRadialGradient(x - planet.size * 0.3, y - planet.size * 0.3, 0, x, y, planet.size);
    gradient.addColorStop(0, lightenColor(planet.color, 40));
    gradient.addColorStop(0.7, planet.color);
    gradient.addColorStop(1, darkenColor(planet.color, 40));

    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Saturn rings
    if (planet.name === "Saturn") {
      ctx.beginPath();
      ctx.ellipse(x, y, planet.size + 10, 6, -0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(210, 180, 120, 0.7)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Planet name label
    if (isHighlighted) {
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "center";
      ctx.fillText(planet.name, x, y - planet.size - 10);
    }
  };

  const lightenColor = (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const darkenColor = (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (timestamp: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const delta = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      if (isPlaying) {
        timeRef.current += delta * speed;
      }

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw(ctx, width, height, timeRef.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isPlaying, speed, draw]);

  // Handle canvas clicks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedPlanet: PlanetData | null = null;

    for (const pos of planetPositionsRef.current) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(pos.size + 5, 15);

      if (distance <= hitRadius) {
        clickedPlanet = planets.find((p) => p.name === pos.name) || null;
        break;
      }
    }

    if (clickedPlanet) {
      setSelectedPlanet(clickedPlanet);
    } else {
      setSelectedPlanet(null);
    }
  };

  // Handle canvas hover
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const pos of planetPositionsRef.current) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(pos.size + 5, 15);

      if (distance <= hitRadius) {
        setHoveredPlanet(pos.name);
        canvas.style.cursor = "pointer";
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = "default";
    }
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <h1 className="text-white text-xl md:text-2xl font-bold tracking-wide">
          <span className="text-yellow-400">☀</span> Solar System Explorer
        </h1>
        <div className="text-white/60 text-sm hidden md:block">
          Click on a planet to learn more
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
      />

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/10">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          )}
        </button>

        {/* Speed controls */}
        <div className="flex items-center gap-1">
          <span className="text-white/60 text-xs mr-1">Speed:</span>
          {speedOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                speed === s
                  ? "bg-yellow-500/80 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-16 right-4 z-10 w-80 bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-white shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full shadow-lg"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lightenCSS(selectedPlanet.color)}, ${selectedPlanet.color})`,
                }}
              />
              <h2 className="text-xl font-bold">{selectedPlanet.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Diameter"
              value={`${selectedPlanet.diameter.toLocaleString()} km`}
              icon="📏"
            />
            <InfoCard
              label="Distance from Sun"
              value={`${selectedPlanet.distanceFromSun} M km`}
              icon="🌞"
            />
            <InfoCard
              label="Orbital Period"
              value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
              icon="🔄"
            />
            <InfoCard
              label="Relative Size"
              value={`${(selectedPlanet.diameter / 12756).toFixed(2)}x Earth`}
              icon="🌍"
            />
          </div>
        </div>
      )}

      {/* Planet Quick Select */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1.5">
        {planets.map((planet) => (
          <button
            key={planet.name}
            onClick={() => setSelectedPlanet(planet)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPlanet?.name === planet.name
                ? "bg-white/20 text-white border border-white/20"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-transparent"
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
            {planet.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-white/50 text-[10px] uppercase tracking-wider">{label}</div>
      <div className="text-white font-semibold text-sm mt-0.5">{value}</div>
    </div>
  );
}

function lightenCSS(color: string): string {
  const hex = color.replace("#", "");
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 60);
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 60);
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 60);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) return `${days} days`;
  const years = (days / 365.25).toFixed(1);
  return `${years} years`;
}
