const Loading = () => {
    return (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
            <div className="relative h-16 w-16 md:h-24 md:w-24">
                <video className="h-full w-full object-contain" autoPlay loop muted playsInline>
                    <source src="/Animation - 1729581332380.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}

export default Loading
