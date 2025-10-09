import React from "react";
import "./FloatingSymbol.css";

const symbols = ["{", "}", "<>", "</>", "∑", "π", "=", ";", "∞", "λ", "()", "=>", "√"];

const FloatingSymbols = () => {
    return (
        <div className="floating-symbols-container">
            {symbols.map((symbol, i) => (
                <span
                    key={i}
                    className="floating-symbol"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        fontSize: `${Math.random() * 2 + 1}rem`,
                    }}
                >
          {symbol}
        </span>
            ))}
        </div>
    );
};

export default FloatingSymbols;
