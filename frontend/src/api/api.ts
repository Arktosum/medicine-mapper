import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Illness, Link, Medicine, SearchResponse } from '../types';

const base = 'http://localhost:3005/api'


export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: base }),
    tagTypes: ['Medicine', 'Illness', 'Link'],
    endpoints: builder => ({
        getMedicines: builder.query<Medicine[], void>({
            query: () => '/medicines',
            providesTags: res =>
                res
                    ? [
                        ...res.map(m => ({ type: 'Medicine' as const, id: m.id })),
                        { type: 'Medicine', id: 'LIST' },
                    ]
                    : [{ type: 'Medicine', id: 'LIST' }],
        }),
        addMedicine: builder.mutation<Medicine, { name: string }>({
            query: body => ({ url: '/medicines', method: 'POST', body }),
            invalidatesTags: [{ type: 'Medicine', id: 'LIST' }],
        }),
        updateMedicine: builder.mutation<Medicine, { id: string; name: string }>({
            query: ({ id, name }) => ({ url: `/medicines/${id}`, method: 'PUT', body: { name } }),
            invalidatesTags: (res, err, { id }) => [
                { type: 'Medicine', id },
                { type: 'Medicine', id: 'LIST' },
                { type: 'Link', id: 'LIST' },
            ],
        }),
        deleteMedicine: builder.mutation<void, string>({
            query: id => ({ url: `/medicines/${id}`, method: 'DELETE' }),
            invalidatesTags: (res, err, id) => [
                { type: 'Medicine', id },
                { type: 'Medicine', id: 'LIST' },
                { type: 'Link', id: 'LIST' },
            ],
        }),

        getIllnesses: builder.query<Illness[], void>({
            query: () => '/illnesses',
            providesTags: res =>
                res
                    ? [
                        ...res.map(i => ({ type: 'Illness' as const, id: i.id })),
                        { type: 'Illness', id: 'LIST' },
                    ]
                    : [{ type: 'Illness', id: 'LIST' }],
        }),
        addIllness: builder.mutation<Illness, { name: string }>({
            query: body => ({ url: '/illnesses', method: 'POST', body }),
            invalidatesTags: [{ type: 'Illness', id: 'LIST' }],
        }),
        updateIllness: builder.mutation<Illness, { id: string; name: string }>({
            query: ({ id, name }) => ({ url: `/illnesses/${id}`, method: 'PUT', body: { name } }),
            invalidatesTags: (res, err, { id }) => [
                { type: 'Illness', id },
                { type: 'Illness', id: 'LIST' },
                { type: 'Link', id: 'LIST' },
            ],
        }),
        deleteIllness: builder.mutation<void, string>({
            query: id => ({ url: `/illnesses/${id}`, method: 'DELETE' }),
            invalidatesTags: (res, err, id) => [
                { type: 'Illness', id },
                { type: 'Illness', id: 'LIST' },
                { type: 'Link', id: 'LIST' },
            ],
        }),

        link: builder.mutation<{ ok: true }, { medicineId: string; illnessId: string }>({
            query: body => ({ url: '/links', method: 'POST', body }),
            invalidatesTags: [
                { type: 'Medicine', id: 'LIST' },
                { type: 'Illness', id: 'LIST' },
                { type: 'Link', id: 'LIST' },
            ],
        }),

        search: builder.query<SearchResponse, { type: 'medicine' | 'illness'; q: string }>({
            query: ({ type, q }) => `/search?type=${type}&q=${encodeURIComponent(q)}`,
        }),
        getLinks: builder.query<Link[], void>({
            query: () => '/links',
            providesTags: [{ type: 'Link', id: 'LIST' }],
        }),

    }),
})

export const {
    useGetMedicinesQuery,
    useAddMedicineMutation,
    useUpdateMedicineMutation,
    useDeleteMedicineMutation,
    useGetIllnessesQuery,
    useAddIllnessMutation,
    useUpdateIllnessMutation,
    useDeleteIllnessMutation,
    useLinkMutation,
    useLazySearchQuery,
    useGetLinksQuery
} = api