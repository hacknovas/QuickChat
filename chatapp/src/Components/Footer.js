import React from "react";

export default function Footer() {
  return (
    <>
      <div className="border p-2 bg-light">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <img
              src="./logo.png"
              style={{
                height: "10vmin",
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: "0.9rem",margin:"0.5rem" }}>- Currently v1.1.0.</div>
          </div>
        </div>

        <div className="text-center" style={{ fontSize: "0.9rem" }}>
          <div>
            <a className="" style={{ textDecoration: "none" }}>
              @HackNovas
            </a>
          </div>
          <div>
            <a
              href="mailto: creatives.doni@gmail.com"
              style={{ textDecoration: "none" }}
            >
              creatives.doni@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
