import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform float uAttenuation;
uniform float uLineThickness;

uniform float uBaseRadius;
uniform float uRadiusStep;
uniform float uScaleRate;

uniform float uOpacity;
uniform float uNoiseAmount;
uniform float uRotation;
uniform float uRingGap;

uniform float uFadeIn;
uniform float uFadeOut;

uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uColorTwo;

uniform int uRingCount;

const float PI = 3.14159265359;
const float HALF_PI = 1.57079632679;
const float CYCLE = 3.45;

float fadeRing(float t) {
  if (t < uFadeIn) {
    return smoothstep(0.0, uFadeIn, t);
  }

  return 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float drawRing(vec2 p, float baseR, float gapPow, float delay, float px) {
  float t = mod(uTime + delay, CYCLE);

  float r = baseR + (t / CYCLE) * uScaleRate;

  float d = abs(length(p) - r);

  float angle = atan(abs(p.y), abs(p.x)) / HALF_PI;

  float thickness =
    max(1.0 - angle, 0.5) * px * uLineThickness;

  float glow =
    (1.0 - smoothstep(thickness, thickness * 1.5, d)) + 1.0;

  d += pow(gapPow * angle, 3.0) * r;

  return glow * exp(-uAttenuation * d) * fadeRing(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);

  vec2 p =
    (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;

  float c = cos(uRotation);
  float s = sin(uRotation);

  p = mat2(c, -s, s, c) * p;

  vec3 color = vec3(0.0);

  float maxIndex =
    max(float(uRingCount) - 1.0, 1.0);

  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;

    float fi = float(i);

    vec3 ringColor =
      mix(uColor, uColorTwo, fi / maxIndex);

    float ringAlpha = drawRing(
      p,
      uBaseRadius + fi * uRadiusStep,
      pow(uRingGap, fi),
      i == 0 ? 0.0 : fi * 2.95,
      px
    );

    color = mix(color, ringColor, ringAlpha);
  }

  float noise = fract(
    sin(dot(gl_FragCoord.xy + uTime * 100.0,
    vec2(12.9898, 78.233))) * 43758.5453
  );

  color += (noise - 0.5) * uNoiseAmount;

  float alpha =
    max(color.r, max(color.g, color.b)) * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`;

export default function MagicRings({
  color = "#fc42ff",
  colorTwo = "#42fcff",
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.08,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0.1,
      10
    );

    camera.position.z = 1;

    const uniforms = {
      uTime: { value: 0 },

      uAttenuation: { value: attenuation },
      uLineThickness: { value: lineThickness },

      uBaseRadius: { value: baseRadius },
      uRadiusStep: { value: radiusStep },
      uScaleRate: { value: scaleRate },

      uOpacity: { value: opacity },
      uNoiseAmount: { value: noiseAmount },
      uRotation: {
        value: (rotation * Math.PI) / 180,
      },
      uRingGap: { value: ringGap },

      uFadeIn: { value: fadeIn },
      uFadeOut: { value: fadeOut },

      uResolution: {
        value: new THREE.Vector2(),
      },

      uColor: {
        value: new THREE.Color(color),
      },

      uColorTwo: {
        value: new THREE.Color(colorTwo),
      },

      uRingCount: { value: ringCount },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      material
    );

    scene.add(mesh);

    const resize = () => {
      const w = mount.clientWidth || 300;
      const h = mount.clientHeight || 300;

      renderer.setSize(w, h);

      uniforms.uResolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId;

    const animate = (time) => {
      uniforms.uTime.value = time * 0.001 * speed;

      renderer.render(scene, camera);

      animationId =
        requestAnimationFrame(animate);
    };

    animationId =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener(
        "resize",
        resize
      );

      scene.remove(mesh);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (
        mount &&
        renderer.domElement.parentNode === mount
      ) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [
    color,
    colorTwo,
    speed,
    ringCount,
    attenuation,
    lineThickness,
    baseRadius,
    radiusStep,
    scaleRate,
    opacity,
    blur,
    noiseAmount,
    rotation,
    ringGap,
    fadeIn,
    fadeOut,
  ]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{
        minHeight: "300px",
        width: "100%",
        height: "100%",
        filter:
          blur > 0
            ? `blur(${blur}px)`
            : "none",
      }}
    />
  );
}