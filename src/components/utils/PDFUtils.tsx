"use client";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { useState } from "react";

export function MyPDFViewer({
  fileUrl,
  download,
}: {
  fileUrl: string;
  download?: boolean;
}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            ShowSearchPopover,
            ZoomOut,
            Zoom,
            ZoomIn,
            GoToPreviousPage,
            CurrentPageInput,
            NumberOfPages,
            GoToNextPage,
            Print,
            EnterFullScreen,
            Download,
          } = slots;
          return (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <ShowSearchPopover />
              <ZoomOut />
              <Zoom />
              <ZoomIn />
              <GoToPreviousPage />
              <CurrentPageInput /> / <NumberOfPages />
              <GoToNextPage />
              {download && <Print />}
              {download && <Download />}
              <EnterFullScreen />
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  const zoomPluginInstance = zoomPlugin();
  const { zoomTo } = zoomPluginInstance;

  // Simpan zoom level manual
  const [zoom, setZoom] = useState(1);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    e.preventDefault();

    let newZoom = zoom;

    if (e.deltaY < 0) {
      newZoom = zoom + 0.1;
    } else {
      newZoom = zoom - 0.1;
    }

    if (newZoom < 0.5) newZoom = 0.5;
    if (newZoom > 3) newZoom = 3;

    setZoom(newZoom);
    animateZoom(zoom, newZoom);
  };

  function animateZoom(from: number, to: number, duration = 200) {
    const startTime = performance.now();

    function step(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentZoom = from + (to - from) * progress;
      zoomTo(currentZoom);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setZoom(to);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <div
      style={{
        height: "100%",
        border: "1px solid black",
        transition: "transform 0.3s ease",
      }}
      onWheel={handleWheel}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
        />
      </Worker>
    </div>
  );
}
