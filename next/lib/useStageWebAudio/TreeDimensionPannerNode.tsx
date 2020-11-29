import {IAudioContext, IAudioNode, IPannerNode, IStereoPannerNode} from "standardized-audio-context";
import debug from "debug";

const d = debug('useStageWebAudio:immersive');

let iOSSafari = false;

if (process.browser) {
    // Client-side-only code
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
    if( iOSSafari) {
        d('iOS Safari does not support immersive audio, yet. Falling back to stereo panning.')
    } else {
        d('Using 3D Audio')
    }
}

function isPannerNode(node: IPannerNode<IAudioContext> | IStereoPannerNode<IAudioContext>): node is IPannerNode<IAudioContext> {
    return (node as IPannerNode<IAudioContext>).coneInnerAngle !== undefined;
}

class TreeDimensionPannerNode {
    private readonly audioContext: IAudioContext;
    private readonly node: IPannerNode<IAudioContext> | IStereoPannerNode<IAudioContext>;

    constructor(audioContext: IAudioContext) {
        this.audioContext = audioContext;
        if (iOSSafari) {
            this.node = audioContext.createStereoPanner();
            this.node.pan.value = 0;
        } else {
            this.node = audioContext.createPanner();
            this.node.panningModel = 'HRTF';
            this.node.distanceModel = 'inverse';
        }
    }

    public setPosition = (x: number, y: number, z: number) => {
        if (isPannerNode(this.node)) {
            this.node.positionX.setValueAtTime(x, this.audioContext.currentTime);
            this.node.positionY.setValueAtTime(y, this.audioContext.currentTime);
            this.node.positionZ.setValueAtTime(z, this.audioContext.currentTime);
        }
    }

    public setPositionX = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.positionX.setValueAtTime(value, this.audioContext.currentTime);
        }
    }
    public setPositionY = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.positionY.setValueAtTime(value, this.audioContext.currentTime);
        }
    }
    public setPositionZ = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.positionZ.setValueAtTime(value, this.audioContext.currentTime);
        }
    }

    public setOrientation = (x: number, y: number, z: number) => {
        if (isPannerNode(this.node)) {
            this.node.orientationX.setValueAtTime(x, this.audioContext.currentTime);
            this.node.orientationY.setValueAtTime(y, this.audioContext.currentTime);
            this.node.orientationZ.setValueAtTime(z, this.audioContext.currentTime);
        }
    }

    public setOrientationX = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.orientationX.setValueAtTime(value, this.audioContext.currentTime);
        }
    }

    public setOrientationY = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.orientationY.setValueAtTime(value, this.audioContext.currentTime);
        }
    }
    public setOrientationZ = (value: number) => {
        if (isPannerNode(this.node)) {
            this.node.orientationZ.setValueAtTime(value, this.audioContext.currentTime);
        }
    }

    public connect = (destinationNode: IAudioNode<IAudioContext>, output?: number, input?: number) => {
        return this.node.connect(destinationNode, output);
    }

    public disconnect = (output?: number) => {
        return this.node.disconnect(output);
    };

    public getNode = () => {
        return this.node;
    }
}

export default TreeDimensionPannerNode;
