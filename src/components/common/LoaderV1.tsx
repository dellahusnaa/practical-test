const Loader = (props: {
    root?: boolean
} = { root: false }) => {
    return (
        <div className="fixed w-full h-full z-1200">
            <div className={"flex items-center justify-center bg-white bg-opacity-70 " + (props.root ? ("h-full") : ("h-full"))}>
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        </div>
    );
};

export default Loader;
