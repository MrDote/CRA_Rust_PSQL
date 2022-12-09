import Head from 'next/head'

export default function HomePage() {
    return (
        <div>
            <Head>
                <title>GreenSt</title>
            </Head>
            <div className='flex justify-center items-center'>
                <div className='bg-black'>
                    Helo
                </div>
            </div>
        </div>
    )
}