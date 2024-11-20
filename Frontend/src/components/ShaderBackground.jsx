import React, { useEffect, useRef } from "react";

const ShaderBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 is not supported in this browser.");
      return;
    }

    const resizeCanvas = () => {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }`;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      out vec4 O;
      uniform float time;
      uniform vec2 resolution;
      #define FC gl_FragCoord.xy
      #define R resolution
      #define T time
      #define hue(a) (.6+.6*cos(6.3*(a)+vec3(0,83,21)))
      float rnd(float a) {
        vec2 p=fract(a*vec2(12.9898,78.233)); p+=dot(p,p*345.);
        return fract(p.x*p.y);
      }
      vec3 pattern(vec2 uv) {
        vec3 col=vec3(0);
        for (float i=0.0; i<20.0; i++) {
          float a=rnd(i);
          vec2 n=vec2(a,fract(a*34.56)), p=sin(n*(T+7.0)+T*0.5);
          float d=dot(uv-p,uv-p);
          col+=0.00125/d*hue(dot(uv,uv)+i*0.125+T);
        }
        return col;
      }
      void main(void) {
        vec2 uv=(FC-0.5*R)/min(R.x,R.y);
        vec3 col=vec3(0);
        float s=2.4, a=atan(uv.x,uv.y), b=length(uv);
        uv=vec2(a*5.0/6.28318,0.05/tan(b)+T);
        uv=fract(uv)-0.5;
        col+=pattern(uv*s);
        O=vec4(col,1.0);
      }`;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (gl, vertexShader, fragmentShader) => {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    const timeUniformLocation = gl.getUniformLocation(program, "time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const render = (time) => {
      resizeCanvas();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(timeUniformLocation, time * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    };

    resizeCanvas();
    render(0);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
};

export default ShaderBackground;
