import React, { useState, useEffect, useRef } from "react";
import { FALLBACK_BANNER, handleImageError } from "../utils/imageFallback.js";

export default function PromoBannerCarousel({ banners = [], go }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const timerRef = useRef(null);

  const bannerList = banners.length > 0 ? banners : [];

  useEffect(() => {
    if (bannerList.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bannerList.length, isHovered]);

  if (!bannerList.length) return null;

  const current = bannerList[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length);
  };

  const handleCopyCode = (e, code) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    }
  };

  const handleAction = (banner) => {
    if (banner.promoCode) {
      go(banner.targetTab || "movies", { promoCode: banner.promoCode });
    } else {
      go(banner.targetTab || "promotions");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        margin: "24px 0 36px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        background: current.bgGradient || "linear-gradient(135deg, #1e1b4b, #312e81)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Ambient Glow */}
      <div style={{ position: "relative", minHeight: 280, display: "flex", alignItems: "center" }}>
        {current.imageUrl && (
          <img
            src={current.imageUrl}
            alt={current.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_BANNER)}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "60%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
              maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.75) 60%, rgba(17, 24, 39, 0.2) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "36px 40px",
            maxWidth: 620,
            color: "#fff",
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span
              style={{
                background: current.badgeColor || "var(--brand-600)",
                color: "#fff",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {current.badge || "ƯU ĐÃI HOT"}
            </span>
            {current.tagline && (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                {current.tagline}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 10px",
              lineHeight: 1.25,
            }}
          >
            {current.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 14.5,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.55,
              margin: "0 0 20px",
            }}
          >
            {current.description}
          </p>

          {/* Actions: Code Badge + CTA Button */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            {current.promoCode && (
              <div
                onClick={(e) => handleCopyCode(e, current.promoCode)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1.5px dashed rgba(255,255,255,0.45)",
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                title="Bấm để sao chép mã"
              >
                <span style={{ fontSize: 13 }}>🏷️</span>
                <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "1px", color: "#fef08a" }}>
                  {current.promoCode}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    padding: "2px 6px",
                    background: copiedCode === current.promoCode ? "var(--green-500)" : "rgba(255,255,255,0.25)",
                    borderRadius: 4,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {copiedCode === current.promoCode ? "✓ Đã chép" : "Chép mã"}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleAction(current)}
              className="btn btn-primary"
              style={{
                padding: "8px 22px",
                fontWeight: 700,
                fontSize: 13.5,
                background: "var(--brand-500)",
                border: "none",
                borderRadius: 8,
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
              }}
            >
              {current.btnText || "Xem chi tiết & Đặt vé"} →
            </button>

            <button
              type="button"
              onClick={() => go("promotions")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
                padding: "6px 10px",
              }}
            >
              Tất cả khuyến mãi
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Nav Buttons */}
      {bannerList.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous banner"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "all 0.15s ease",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next banner"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "all 0.15s ease",
            }}
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 20,
              zIndex: 10,
              display: "flex",
              gap: 6,
            }}
          >
            {bannerList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: idx === currentIndex ? "var(--brand-500)" : "rgba(255,255,255,0.35)",
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
