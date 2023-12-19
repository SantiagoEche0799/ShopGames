import { Link } from "react-router-dom";
import Logo from '../assets/logo.png';

const CatePage = () => {

    return (
        <div className="flex justify-center">
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/cate/Action`}>
                        <img
                            className="rounded-t-lg"
                            src={Logo}
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Action`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Action
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/Adventure`}>
                        <img
                            className="rounded-t-lg"
                            src={Logo}
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Adventure`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Adventure
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/Fight`}>
                        <img
                            className="rounded-t-lg"
                            src={Logo}
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Fight`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Fight
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/RPG`}>
                        <img
                            className="rounded-t-lg"
                            src={Logo}
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/RPG`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                RPG
                            </h5>
                        </Link>
                    </div>
                </div>
                

            </div>
        </div>
    );
};
export default CatePage;