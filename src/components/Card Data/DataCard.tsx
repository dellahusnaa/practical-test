"use client";


// Interface untuk tipe props DataCard
interface DataCardProps {
    data: Array<{
        id: string,
        judul: string,
        caption: string,
    }>,
}

function DataCard({ data }: DataCardProps) {
    return (
        <div className="w-full cursor-pointer flex-wrap flex m-0">
            {data.map((item, index) => (
                <div key={index} className="flex flex-wrap w-1/3 p-2">
                    <div className="w-full p-2 font-roboto-normal drop-shadow-sm rounded-md border-2 border-m-400 hover:bg-m-200 flex flex-wrap justify-content-center align-items-center">
                        <div className="w-1/3  grid place-content-center h-full">
                            
                        </div>
                        <div className="my-3 grid place-items-stretch w-2/3">
                            <div className="w-fit grid place-items-center ">
                                <div
                                    className='m-0 font-bold grid place-items-center text-18 h-full w-full'
                                    style={{
                                        textAlign: 'left',
                                    }}
                                >
                                    {item.judul}
                                </div>
                            </div>
                            {/* <div className="h-4" /> */}
                            <div className="flex h-full w-fit">
                                <div className='label-l14 grid place-items-center text-12 text-m-500'>
                                    {item.caption}
                                </div>
                              
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DataCard;
