'use client'
import { NextPage } from "next";
import React from "react";
import { useFormState } from 'react-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  getSortedRowModel,
  SortingFn,
  SortingState,
} from '@tanstack/react-table'
import { SubmitButton } from '@/components/buttons/submit-button'
import { getRizStats } from '@/app/actions/actions'
import { BarsArrowDownIcon, BarsArrowUpIcon} from '@heroicons/react/16/solid'

type DeliveryRow = {
  itemcode: string
  dscription: string
  quantity: number
}

const columnHelper = createColumnHelper<DeliveryRow>()

const columns = [
  columnHelper.accessor('itemcode', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
    meta: {
      text_align: () => ""
    },
  }),
  columnHelper.accessor(row => row.dscription, {
    id: 'dscription',
    cell: info => info.getValue(),
    header: () => <span>Description</span>,
    footer: info => info.column.id,
    meta: {
      text_align: () => ""
    },
  }),
  columnHelper.accessor('quantity', {
    header: () => 'Quantité (sac)',
    cell: info => info.getValue(),
    footer: info => info.column.id,
    meta: {
      text_align: () => "text-right"
    },
  })
]
const applyStyleToTd = (tdStyle: string, meta: any) => {
  if(meta){
    return tdStyle+" "+ meta.text_align();
  }
  return tdStyle;
};
const Tables: NextPage = () => {
  const [formState, formAction] = useFormState(getRizStats, null);
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
/*  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/items', {
        method: 'GET',
      });
      if (response.ok) {
        const { data } = await response.json();
        setData(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }; 
    fetchUsers();
  }, []);*/

  const rerender = React.useReducer(() => ({}), {})[1]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    state: {
      sorting,
    },
    onSortingChange: setSorting,

  })

  const thClass = "text-xs md:text-lg font-bold p-2 border-b border-l border-indigo-700 text-left bg-indigo-700 text-white";
  const trClass = "text-xs md:text-lg odd:bg-gray-100 hover:!bg-stone-200";
  const tdClass = "text-[12px] md:text-lg p-2 border-b border-l";
  const dateLabel = "font-bold mb-1 text-gray-700 block";
  const dateInput="pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium";
  React.useEffect(()=>{
    if (formState) {
      setLoading(false);
      setData(formState);
    }
  }, [formState]);
  //if (isLoading) return <p>Loading...</p>
  //if (!data) return <p>No data</p>
  return (
    <div className="p-8 flex flex-col">
      <div>
        <form action={formAction}>
        <div className="flex flex-col">
          <div>
          <label htmlFor="start-date" className={dateLabel}>Date de début:</label>
          <input className={dateInput}
          type="date" name="start-date" />
          </div>
          <div>
          <label className={dateLabel} htmlFor="end-date">Date de fin:</label>
          <input className={dateInput} type="date" name="end-date" />  
          </div>
          <div><SubmitButton/></div>
        </div>
        </form>
      </div>
      <div>
      {formState 
       ?(<table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={thClass}>
                <div className="flex" onClick={header.column.getToggleSortingHandler()}>
                  <span>{flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </span>
                  <span>
                        {{
                          asc: <BarsArrowUpIcon className="size-4 text-blue-500" />,
                          desc: <BarsArrowDownIcon className="size-4 text-blue-500" />,
                        }[header.column.getIsSorted() as string] ?? null}
                  </span>
                </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={trClass}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={applyStyleToTd(tdClass, cell.column.columnDef.meta)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>)
       : null
      }
      <div className="h-4" />
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>
      </div>
    </div>

  )
};

export default Tables;