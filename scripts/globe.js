class Globe {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.width = options.width || 600;
        this.height = options.height || 600;
        this.markers = options.markers || [];
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        this.initShaders();
        this.initBuffers();
        this.initTexture();
        
        this.rotation = 0;
        this.tilt = 0.3;
        this.isAnimating = false;
    }

    initShaders() {
        const vertexShader = `
            attribute vec3 position;
            attribute vec2 texcoord;
            uniform mat4 matrix;
            varying vec2 vTexcoord;
            void main() {
                gl_Position = matrix * vec4(position, 1.0);
                vTexcoord = texcoord;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            uniform sampler2D texture;
            varying vec2 vTexcoord;
            void main() {
                vec4 color = texture2D(texture, vTexcoord);
                gl_FragColor = vec4(color.rgb, 0.9);
            }
        `;

        const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vs, vertexShader);
        this.gl.shaderSource(fs, fragmentShader);
        this.gl.compileShader(vs);
        this.gl.compileShader(fs);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
    }

    initBuffers() {
        // Create sphere vertices
        const segments = 64;
        const vertices = [];
        const indices = [];
        const texcoords = [];

        for (let lat = 0; lat <= segments; lat++) {
            const theta = lat * Math.PI / segments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon <= segments; lon++) {
                const phi = lon * 2 * Math.PI / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                vertices.push(x, y, z);
                texcoords.push(lon / segments, lat / segments);
            }
        }

        for (let lat = 0; lat < segments; lat++) {
            for (let lon = 0; lon < segments; lon++) {
                const first = (lat * (segments + 1)) + lon;
                const second = first + segments + 1;
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        const texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        const texcoordLocation = this.gl.getAttribLocation(this.program, 'texcoord');

        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(texcoordLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        this.gl.vertexAttribPointer(texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.numIndices = indices.length;
    }

    initTexture() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        // Create a temporary 1x1 pixel until the image loads
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255])
        );

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = 'https://raw.githubusercontent.com/PaulleDemon/PaulleDemon.github.io/main/images/earth-map.jpg';
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        };
    }

    animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const draw = () => {
            if (!this.isAnimating) return;

            this.rotation += 0.005;
            this.render();
            requestAnimationFrame(draw);
        };
        
        draw();
    }

    render() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        const aspect = this.width / this.height;
        const matrix = this.createMatrix(aspect);
        
        const matrixLocation = this.gl.getUniformLocation(this.program, 'matrix');
        this.gl.uniformMatrix4fv(matrixLocation, false, matrix);
        
        this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0);
    }

    createMatrix(aspect) {
        const matrix = new Float32Array(16);
        const fieldOfView = Math.PI / 4;
        const near = 1;
        const far = 100;
        
        const f = 1.0 / Math.tan(fieldOfView / 2);
        const rangeInv = 1 / (near - far);

        matrix[0] = f / aspect;
        matrix[5] = f;
        matrix[10] = (near + far) * rangeInv;
        matrix[11] = -1;
        matrix[14] = near * far * rangeInv * 2;
        
        // Rotation
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        matrix[0] *= cos;
        matrix[2] = sin;
        matrix[8] = -sin;
        matrix[10] *= cos;
        
        // Tilt
        const cosTilt = Math.cos(this.tilt);
        const sinTilt = Math.sin(this.tilt);
        matrix[5] = cosTilt;
        matrix[6] = sinTilt;
        matrix[9] = -sinTilt;
        matrix[10] *= cosTilt;
        
        // Translation
        matrix[14] = -6;

        return matrix;
    }

    stop() {
        this.isAnimating = false;
    }
} 