import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {styled, useStyletron} from "styletron-react";
import {LocalConsumer} from "use-digital-stage";

const Wrapper = styled("div", {
    position: 'absolute',
    top: 0,
    left: 0,
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
})


const SingleVideoPlayer = (props: {
    track: MediaStreamTrack;
    width: string;
    height: string;
}) => {
    const {track, width, height} = props;
    const ref = useRef<HTMLVideoElement>();
    const [css] = useStyletron();

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.srcObject = new MediaStream([track]);
        }
    }, [ref, track]);

    return (
        <video
            className={css({
                width: width,
                height: height,
                objectFit: "cover"
            })}
            muted={true}
            playsInline={true}
            autoPlay={true}
            ref={ref}
        />
    );
};

const VideoPlayer = (props: { consumers: LocalConsumer[] }): JSX.Element => {
    const {consumers} = props;
    const wrapperRef = useRef<HTMLDivElement>();
    const [size, setSize] = useState<DOMRect>();
    const [width, setWidth] = useState<string>('100%');
    const [height, setHeight] = useState<string>('100%');

    useEffect(() => {
        if (wrapperRef.current) {
            const handleResize = () => {
                const size: DOMRect = wrapperRef.current.getBoundingClientRect();
                setSize(size);
            };
            wrapperRef.current.addEventListener('resize', handleResize);
            handleResize();
            return () => {
                if (wrapperRef.current) wrapperRef.current.removeEventListener('resize', handleResize);
            };
        }
    }, [wrapperRef]);

    useEffect(() => {
        if( size ) {
            if (consumers.length === 2) {
                setWidth('50%');
                setHeight('100%');
            } else if (consumers.length > 3) {
                const numRows = Math.ceil(Math.sqrt(consumers.length));
                const numColsMax = Math.ceil(consumers.length / numRows);
                const elementWidth = Math.round(size.width / numColsMax);
                const elementHeight = Math.round(size.height / numRows);
                setWidth(elementWidth + 'px');
                setHeight(elementHeight + 'px');
            } else {
                setWidth('100%');
                setHeight('100%');
            }
        }
    }, [size, consumers]);

    return (
        <Wrapper
            ref={wrapperRef}
        >
            {consumers.map((consumer) => (
                <SingleVideoPlayer
                    key={consumer._id}
                    width={width}
                    height={height}
                    track={consumer.consumer.track}
                />
            ))}
        </Wrapper>
    );
};
export default VideoPlayer;
