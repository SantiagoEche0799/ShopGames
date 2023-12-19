/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { Link, useNavigate, } from "react-router-dom";
import { delete_product, get_products } from "../api/product";
import {
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Product } from "../Interfaces";

interface Props {
    results: any;
}

const Products = ( {results} : Props) => {
    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(["products"], get_products, {
        getNextPageParam: (page: any) => page.meta.next,
    });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteProdMutation = useMutation({
        mutationFn: delete_product,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted!");
            navigate('/admin')
            

        },
        onError: (error) => {
            console.error(error);
            navigate('/admin')
            toast.error("Error!");
            
        },
    });

    if (deleteProdMutation.isLoading) return <Loader />;
    if (error instanceof Error) return <>{toast.error(error.message)}</>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            Product ID
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-4 py-3 ">
                            Price
                        </th>
                        <th scope="col" className="px-4 py-3 ">
                            Count in Stock
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 flex items-left justify-center gap-4"
                        >
                            Actions
                            <Link to="add">
                            <FaPlusCircle
                                size={22}
                                className="text-green-300 cursor-pointer"
                            />
                            </Link>
                        </th>

                    </tr>
                </thead>
                {/**Para hacer la busqueda en tiempo real.
                 * Si hay resultados, mostramos los resultados de la busqueda
                 * de lo contrario mostramos loq que ya existe
                 */}
                {results && results.products.length > 0 ? (
                    <>
                        {results &&
                            results.products.map((product: Product) => (
                                <tbody>
                                    <tr className="border-b dark:border-gray-700">
                                        <th
                                            scope="row"
                                            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {product.id}
                                        </th>

                                        <td className="px-4 py-3">
                                            {product.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            $ {product.price}
                                        </td>

                                        <td className="px-4 py-3">
                                            {product.count_in_stock}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-4">
                                                <BsFillTrashFill
                                                    onClick={() => {
                                                        if (
                                                            product.id !==
                                                            undefined
                                                        ) {
                                                            deleteProdMutation.mutate(
                                                                product.id
                                                            );
                                                        }
                                                    }}
                                                    size={22}
                                                    className="text-red-300 cursor-pointer"
                                                />

                                                <Link to={`edit/${product.id}`}>
                                                    <AiFillEdit
                                                        size={22}
                                                        className="text-white cursor-pointer"
                                                    />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                    </>
                ) : (
                    <>
                        {data?.pages.map((page: any) => (
                            <>
                                <tbody key={page.meta.next}>
                                    {page.data.map((product: Product) => (
                                        <tr className="border-b dark:border-gray-700">
                                            <th
                                                scope="row"
                                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {product.id}
                                            </th>

                                            <td className="px-4 py-3">
                                                {product.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                $ {product.price}
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.count_in_stock}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-4">
                                                    <BsFillTrashFill
                                                        onClick={() => {
                                                            if (
                                                                product.id !==
                                                                undefined
                                                            ) {
                                                                deleteProdMutation.mutate(
                                                                    product.id
                                                                );
                                                            }
                                                        }}
                                                        size={22}
                                                        className="text-red-300 cursor-pointer"
                                                    />

                                                    <Link
                                                        to={`edit/${product.id}`}
                                                    >
                                                        <AiFillEdit
                                                            size={22}
                                                            className="text-white cursor-pointer"
                                                        />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {!isLoading && data?.pages.length === 0 && (
                                    <p className="text-xl text-slate-800 dark:text-slate-200">
                                        No more results
                                    </p>
                                )}
                                {!isLoading &&
                                    data?.pages?.length !== undefined &&
                                    data.pages.length > 0 &&
                                    hasNextPage && (
                                        <div ref={ref}>
                                            {isLoading || isFetchingNextPage ? (
                                                <Loader />
                                            ) : data.pages.length}
                                        </div>
                                    )}
                            </>
                        ))}
                    </>
                )}
            </table>
        </div>
    );
};
export default Products;