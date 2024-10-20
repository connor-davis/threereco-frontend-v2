// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-fetch';
import { queryOptions, type UseMutationOptions, infiniteQueryOptions, type InfiniteData } from '@tanstack/react-query';
import { client, getApi, postApiAuthenticationLogin, postApiAuthenticationLogout, postApiAuthenticationRegister, getApiAuthenticationCheck, getApiAuthenticationMfaEnable, postApiAuthenticationMfaVerify, putApiAuthenticationPasswordReset, getApiUsers, postApiUsers, getApiUsersById, putApiUsersById, deleteApiUsersById, getApiUsersPaging, getApiBusinesses, postApiBusinesses, putApiBusinesses, deleteApiBusinesses, getApiCollectors, postApiCollectors, deleteApiCollectors, putApiCollectors, getApiProducts, postApiProducts, deleteApiProducts, putApiProducts, getApiCollections, postApiCollections, deleteApiCollections, putApiCollections, getApiCollectionsExport } from '../services.gen';
import type { PostApiAuthenticationLoginData, PostApiAuthenticationLoginError, PostApiAuthenticationLoginResponse, PostApiAuthenticationLogoutError, PostApiAuthenticationLogoutResponse, PostApiAuthenticationRegisterData, PostApiAuthenticationRegisterError, PostApiAuthenticationRegisterResponse, PostApiAuthenticationMfaVerifyData, PostApiAuthenticationMfaVerifyError, PostApiAuthenticationMfaVerifyResponse, PutApiAuthenticationPasswordResetData, PutApiAuthenticationPasswordResetError, PutApiAuthenticationPasswordResetResponse, GetApiUsersData, GetApiUsersError, GetApiUsersResponse, PostApiUsersData, PostApiUsersError, PostApiUsersResponse, GetApiUsersByIdData, PutApiUsersByIdData, PutApiUsersByIdError, PutApiUsersByIdResponse, DeleteApiUsersByIdData, DeleteApiUsersByIdError, DeleteApiUsersByIdResponse, GetApiUsersPagingData, GetApiBusinessesData, GetApiBusinessesError, GetApiBusinessesResponse, PostApiBusinessesData, PostApiBusinessesError, PostApiBusinessesResponse, PutApiBusinessesData, PutApiBusinessesError, PutApiBusinessesResponse, DeleteApiBusinessesData, DeleteApiBusinessesError, DeleteApiBusinessesResponse, GetApiCollectorsData, GetApiCollectorsError, GetApiCollectorsResponse, PostApiCollectorsData, PostApiCollectorsError, PostApiCollectorsResponse, DeleteApiCollectorsData, DeleteApiCollectorsError, DeleteApiCollectorsResponse, PutApiCollectorsData, PutApiCollectorsError, PutApiCollectorsResponse, GetApiProductsData, GetApiProductsError, GetApiProductsResponse, PostApiProductsData, PostApiProductsError, PostApiProductsResponse, DeleteApiProductsData, DeleteApiProductsError, DeleteApiProductsResponse, PutApiProductsData, PutApiProductsError, PutApiProductsResponse, GetApiCollectionsData, GetApiCollectionsError, GetApiCollectionsResponse, PostApiCollectionsData, PostApiCollectionsError, PostApiCollectionsResponse, DeleteApiCollectionsData, DeleteApiCollectionsError, DeleteApiCollectionsResponse, PutApiCollectionsData, PutApiCollectionsError, PutApiCollectionsResponse, GetApiCollectionsExportData, GetApiCollectionsExportError, GetApiCollectionsExportResponse } from '../types.gen';

type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseUrl' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): QueryKey<TOptions>[0] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseUrl: (options?.client ?? client).getConfig().baseUrl } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return params;
};

export const getApiQueryKey = (options?: Options) => [
    createQueryKey("getApi", options)
];

export const getApiOptions = (options?: Options) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApi({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiQueryKey(options)
}); };

export const postApiAuthenticationLoginQueryKey = (options: Options<PostApiAuthenticationLoginData>) => [
    createQueryKey("postApiAuthenticationLogin", options)
];

export const postApiAuthenticationLoginOptions = (options: Options<PostApiAuthenticationLoginData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiAuthenticationLogin({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiAuthenticationLoginQueryKey(options)
}); };

export const postApiAuthenticationLoginMutation = (options?: Partial<Options<PostApiAuthenticationLoginData>>) => { const mutationOptions: UseMutationOptions<PostApiAuthenticationLoginResponse, PostApiAuthenticationLoginError, Options<PostApiAuthenticationLoginData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiAuthenticationLogin({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const postApiAuthenticationLogoutQueryKey = (options?: Options) => [
    createQueryKey("postApiAuthenticationLogout", options)
];

export const postApiAuthenticationLogoutOptions = (options?: Options) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiAuthenticationLogout({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiAuthenticationLogoutQueryKey(options)
}); };

export const postApiAuthenticationLogoutMutation = (options?: Partial<Options>) => { const mutationOptions: UseMutationOptions<PostApiAuthenticationLogoutResponse, PostApiAuthenticationLogoutError, Options> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiAuthenticationLogout({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const postApiAuthenticationRegisterQueryKey = (options?: Options<PostApiAuthenticationRegisterData>) => [
    createQueryKey("postApiAuthenticationRegister", options)
];

export const postApiAuthenticationRegisterOptions = (options?: Options<PostApiAuthenticationRegisterData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiAuthenticationRegister({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiAuthenticationRegisterQueryKey(options)
}); };

export const postApiAuthenticationRegisterMutation = (options?: Partial<Options<PostApiAuthenticationRegisterData>>) => { const mutationOptions: UseMutationOptions<PostApiAuthenticationRegisterResponse, PostApiAuthenticationRegisterError, Options<PostApiAuthenticationRegisterData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiAuthenticationRegister({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiAuthenticationCheckQueryKey = (options?: Options) => [
    createQueryKey("getApiAuthenticationCheck", options)
];

export const getApiAuthenticationCheckOptions = (options?: Options) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiAuthenticationCheck({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiAuthenticationCheckQueryKey(options)
}); };

export const getApiAuthenticationMfaEnableQueryKey = (options?: Options) => [
    createQueryKey("getApiAuthenticationMfaEnable", options)
];

export const getApiAuthenticationMfaEnableOptions = (options?: Options) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiAuthenticationMfaEnable({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiAuthenticationMfaEnableQueryKey(options)
}); };

export const postApiAuthenticationMfaVerifyQueryKey = (options: Options<PostApiAuthenticationMfaVerifyData>) => [
    createQueryKey("postApiAuthenticationMfaVerify", options)
];

export const postApiAuthenticationMfaVerifyOptions = (options: Options<PostApiAuthenticationMfaVerifyData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiAuthenticationMfaVerify({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiAuthenticationMfaVerifyQueryKey(options)
}); };

export const postApiAuthenticationMfaVerifyMutation = (options?: Partial<Options<PostApiAuthenticationMfaVerifyData>>) => { const mutationOptions: UseMutationOptions<PostApiAuthenticationMfaVerifyResponse, PostApiAuthenticationMfaVerifyError, Options<PostApiAuthenticationMfaVerifyData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiAuthenticationMfaVerify({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const putApiAuthenticationPasswordResetMutation = (options?: Partial<Options<PutApiAuthenticationPasswordResetData>>) => { const mutationOptions: UseMutationOptions<PutApiAuthenticationPasswordResetResponse, PutApiAuthenticationPasswordResetError, Options<PutApiAuthenticationPasswordResetData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiAuthenticationPasswordReset({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiUsersQueryKey = (options?: Options<GetApiUsersData>) => [
    createQueryKey("getApiUsers", options)
];

export const getApiUsersOptions = (options?: Options<GetApiUsersData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiUsers({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiUsersQueryKey(options)
}); };

const createInfiniteParams = <K extends Pick<QueryKey<Options>[0], 'body' | 'headers' | 'path' | 'query'>>(queryKey: QueryKey<Options>, page: K) => {
    const params = queryKey[0];
    if (page.body) {
        params.body = {
            ...queryKey[0].body as any,
            ...page.body as any
        };
    }
    if (page.headers) {
        params.headers = {
            ...queryKey[0].headers,
            ...page.headers
        };
    }
    if (page.path) {
        params.path = {
            ...queryKey[0].path,
            ...page.path
        };
    }
    if (page.query) {
        params.query = {
            ...queryKey[0].query,
            ...page.query
        };
    }
    return params as unknown as typeof page;
};

export const getApiUsersInfiniteQueryKey = (options?: Options<GetApiUsersData>): QueryKey<Options<GetApiUsersData>> => [
    createQueryKey("getApiUsers", options, true)
];

export const getApiUsersInfiniteOptions = (options?: Options<GetApiUsersData>) => { return infiniteQueryOptions<GetApiUsersResponse, GetApiUsersError, InfiniteData<GetApiUsersResponse>, QueryKey<Options<GetApiUsersData>>, number | Pick<QueryKey<Options<GetApiUsersData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiUsersData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                page: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiUsers({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiUsersInfiniteQueryKey(options)
}); };

export const postApiUsersQueryKey = (options: Options<PostApiUsersData>) => [
    createQueryKey("postApiUsers", options)
];

export const postApiUsersOptions = (options: Options<PostApiUsersData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiUsers({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiUsersQueryKey(options)
}); };

export const postApiUsersMutation = (options?: Partial<Options<PostApiUsersData>>) => { const mutationOptions: UseMutationOptions<PostApiUsersResponse, PostApiUsersError, Options<PostApiUsersData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiUsers({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiUsersByIdQueryKey = (options: Options<GetApiUsersByIdData>) => [
    createQueryKey("getApiUsersById", options)
];

export const getApiUsersByIdOptions = (options: Options<GetApiUsersByIdData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiUsersById({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiUsersByIdQueryKey(options)
}); };

export const putApiUsersByIdMutation = (options?: Partial<Options<PutApiUsersByIdData>>) => { const mutationOptions: UseMutationOptions<PutApiUsersByIdResponse, PutApiUsersByIdError, Options<PutApiUsersByIdData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiUsersById({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const deleteApiUsersByIdMutation = (options?: Partial<Options<DeleteApiUsersByIdData>>) => { const mutationOptions: UseMutationOptions<DeleteApiUsersByIdResponse, DeleteApiUsersByIdError, Options<DeleteApiUsersByIdData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await deleteApiUsersById({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiUsersPagingQueryKey = (options?: Options<GetApiUsersPagingData>) => [
    createQueryKey("getApiUsersPaging", options)
];

export const getApiUsersPagingOptions = (options?: Options<GetApiUsersPagingData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiUsersPaging({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiUsersPagingQueryKey(options)
}); };

export const getApiBusinessesQueryKey = (options?: Options<GetApiBusinessesData>) => [
    createQueryKey("getApiBusinesses", options)
];

export const getApiBusinessesOptions = (options?: Options<GetApiBusinessesData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiBusinesses({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiBusinessesQueryKey(options)
}); };

export const getApiBusinessesInfiniteQueryKey = (options?: Options<GetApiBusinessesData>): QueryKey<Options<GetApiBusinessesData>> => [
    createQueryKey("getApiBusinesses", options, true)
];

export const getApiBusinessesInfiniteOptions = (options?: Options<GetApiBusinessesData>) => { return infiniteQueryOptions<GetApiBusinessesResponse, GetApiBusinessesError, InfiniteData<GetApiBusinessesResponse>, QueryKey<Options<GetApiBusinessesData>>, number | Pick<QueryKey<Options<GetApiBusinessesData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiBusinessesData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                page: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiBusinesses({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiBusinessesInfiniteQueryKey(options)
}); };

export const postApiBusinessesQueryKey = (options: Options<PostApiBusinessesData>) => [
    createQueryKey("postApiBusinesses", options)
];

export const postApiBusinessesOptions = (options: Options<PostApiBusinessesData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiBusinesses({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiBusinessesQueryKey(options)
}); };

export const postApiBusinessesMutation = (options?: Partial<Options<PostApiBusinessesData>>) => { const mutationOptions: UseMutationOptions<PostApiBusinessesResponse, PostApiBusinessesError, Options<PostApiBusinessesData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiBusinesses({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const putApiBusinessesMutation = (options?: Partial<Options<PutApiBusinessesData>>) => { const mutationOptions: UseMutationOptions<PutApiBusinessesResponse, PutApiBusinessesError, Options<PutApiBusinessesData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiBusinesses({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const deleteApiBusinessesMutation = (options?: Partial<Options<DeleteApiBusinessesData>>) => { const mutationOptions: UseMutationOptions<DeleteApiBusinessesResponse, DeleteApiBusinessesError, Options<DeleteApiBusinessesData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await deleteApiBusinesses({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiCollectorsQueryKey = (options?: Options<GetApiCollectorsData>) => [
    createQueryKey("getApiCollectors", options)
];

export const getApiCollectorsOptions = (options?: Options<GetApiCollectorsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiCollectors({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectorsQueryKey(options)
}); };

export const getApiCollectorsInfiniteQueryKey = (options?: Options<GetApiCollectorsData>): QueryKey<Options<GetApiCollectorsData>> => [
    createQueryKey("getApiCollectors", options, true)
];

export const getApiCollectorsInfiniteOptions = (options?: Options<GetApiCollectorsData>) => { return infiniteQueryOptions<GetApiCollectorsResponse, GetApiCollectorsError, InfiniteData<GetApiCollectorsResponse>, QueryKey<Options<GetApiCollectorsData>>, number | Pick<QueryKey<Options<GetApiCollectorsData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiCollectorsData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                page: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiCollectors({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectorsInfiniteQueryKey(options)
}); };

export const postApiCollectorsQueryKey = (options?: Options<PostApiCollectorsData>) => [
    createQueryKey("postApiCollectors", options)
];

export const postApiCollectorsOptions = (options?: Options<PostApiCollectorsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiCollectors({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiCollectorsQueryKey(options)
}); };

export const postApiCollectorsMutation = (options?: Partial<Options<PostApiCollectorsData>>) => { const mutationOptions: UseMutationOptions<PostApiCollectorsResponse, PostApiCollectorsError, Options<PostApiCollectorsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiCollectors({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const deleteApiCollectorsMutation = (options?: Partial<Options<DeleteApiCollectorsData>>) => { const mutationOptions: UseMutationOptions<DeleteApiCollectorsResponse, DeleteApiCollectorsError, Options<DeleteApiCollectorsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await deleteApiCollectors({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const putApiCollectorsMutation = (options?: Partial<Options<PutApiCollectorsData>>) => { const mutationOptions: UseMutationOptions<PutApiCollectorsResponse, PutApiCollectorsError, Options<PutApiCollectorsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiCollectors({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiProductsQueryKey = (options?: Options<GetApiProductsData>) => [
    createQueryKey("getApiProducts", options)
];

export const getApiProductsOptions = (options?: Options<GetApiProductsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiProducts({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiProductsQueryKey(options)
}); };

export const getApiProductsInfiniteQueryKey = (options?: Options<GetApiProductsData>): QueryKey<Options<GetApiProductsData>> => [
    createQueryKey("getApiProducts", options, true)
];

export const getApiProductsInfiniteOptions = (options?: Options<GetApiProductsData>) => { return infiniteQueryOptions<GetApiProductsResponse, GetApiProductsError, InfiniteData<GetApiProductsResponse>, QueryKey<Options<GetApiProductsData>>, number | Pick<QueryKey<Options<GetApiProductsData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiProductsData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                page: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiProducts({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiProductsInfiniteQueryKey(options)
}); };

export const postApiProductsQueryKey = (options: Options<PostApiProductsData>) => [
    createQueryKey("postApiProducts", options)
];

export const postApiProductsOptions = (options: Options<PostApiProductsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiProducts({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiProductsQueryKey(options)
}); };

export const postApiProductsMutation = (options?: Partial<Options<PostApiProductsData>>) => { const mutationOptions: UseMutationOptions<PostApiProductsResponse, PostApiProductsError, Options<PostApiProductsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiProducts({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const deleteApiProductsMutation = (options?: Partial<Options<DeleteApiProductsData>>) => { const mutationOptions: UseMutationOptions<DeleteApiProductsResponse, DeleteApiProductsError, Options<DeleteApiProductsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await deleteApiProducts({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const putApiProductsMutation = (options?: Partial<Options<PutApiProductsData>>) => { const mutationOptions: UseMutationOptions<PutApiProductsResponse, PutApiProductsError, Options<PutApiProductsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiProducts({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiCollectionsQueryKey = (options?: Options<GetApiCollectionsData>) => [
    createQueryKey("getApiCollections", options)
];

export const getApiCollectionsOptions = (options?: Options<GetApiCollectionsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiCollections({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectionsQueryKey(options)
}); };

export const getApiCollectionsInfiniteQueryKey = (options?: Options<GetApiCollectionsData>): QueryKey<Options<GetApiCollectionsData>> => [
    createQueryKey("getApiCollections", options, true)
];

export const getApiCollectionsInfiniteOptions = (options?: Options<GetApiCollectionsData>) => { return infiniteQueryOptions<GetApiCollectionsResponse, GetApiCollectionsError, InfiniteData<GetApiCollectionsResponse>, QueryKey<Options<GetApiCollectionsData>>, number | Pick<QueryKey<Options<GetApiCollectionsData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiCollectionsData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                page: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiCollections({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectionsInfiniteQueryKey(options)
}); };

export const postApiCollectionsQueryKey = (options: Options<PostApiCollectionsData>) => [
    createQueryKey("postApiCollections", options)
];

export const postApiCollectionsOptions = (options: Options<PostApiCollectionsData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await postApiCollections({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: postApiCollectionsQueryKey(options)
}); };

export const postApiCollectionsMutation = (options?: Partial<Options<PostApiCollectionsData>>) => { const mutationOptions: UseMutationOptions<PostApiCollectionsResponse, PostApiCollectionsError, Options<PostApiCollectionsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await postApiCollections({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const deleteApiCollectionsMutation = (options?: Partial<Options<DeleteApiCollectionsData>>) => { const mutationOptions: UseMutationOptions<DeleteApiCollectionsResponse, DeleteApiCollectionsError, Options<DeleteApiCollectionsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await deleteApiCollections({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const putApiCollectionsMutation = (options?: Partial<Options<PutApiCollectionsData>>) => { const mutationOptions: UseMutationOptions<PutApiCollectionsResponse, PutApiCollectionsError, Options<PutApiCollectionsData>> = {
    mutationFn: async (localOptions) => {
        const { data } = await putApiCollections({
            ...options,
            ...localOptions,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getApiCollectionsExportQueryKey = (options?: Options<GetApiCollectionsExportData>) => [
    createQueryKey("getApiCollectionsExport", options)
];

export const getApiCollectionsExportOptions = (options?: Options<GetApiCollectionsExportData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getApiCollectionsExport({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectionsExportQueryKey(options)
}); };

export const getApiCollectionsExportInfiniteQueryKey = (options?: Options<GetApiCollectionsExportData>): QueryKey<Options<GetApiCollectionsExportData>> => [
    createQueryKey("getApiCollectionsExport", options, true)
];

export const getApiCollectionsExportInfiniteOptions = (options?: Options<GetApiCollectionsExportData>) => { return infiniteQueryOptions<GetApiCollectionsExportResponse, GetApiCollectionsExportError, InfiniteData<GetApiCollectionsExportResponse>, QueryKey<Options<GetApiCollectionsExportData>>, string | Pick<QueryKey<Options<GetApiCollectionsExportData>>[0], 'body' | 'headers' | 'path' | 'query'>>(
// @ts-ignore
{
    queryFn: async ({ pageParam, queryKey }) => {
        // @ts-ignore
        const page: Pick<QueryKey<Options<GetApiCollectionsExportData>>[0], 'body' | 'headers' | 'path' | 'query'> = typeof pageParam === "object" ? pageParam : {
            query: {
                startDate: pageParam
            }
        };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await getApiCollectionsExport({
            ...options,
            ...params,
            throwOnError: true
        });
        return data;
    },
    queryKey: getApiCollectionsExportInfiniteQueryKey(options)
}); };