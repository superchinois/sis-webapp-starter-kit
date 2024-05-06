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
import { SubmitButton } from '@/components/buttons/submit-button'
import { getRizStats } from '@/app/actions/actions'

type DeliveryRow = {
  itemcode: string
  dscription: string
  quantity: number
  nb_pal: number
}

type Person = {
  name: string
  username: string
  email: string
  phone: string
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.username, {
    id: 'username',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Username</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('email', {
    header: () => 'Email',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('phone', {
    cell: info => <span className="text-base">{info.getValue()}</span>,
    header: () => <span>Phone</span>,
    footer: info => info.column.id,
  })
]
const Tables: NextPage = () => {
  const [formState, formAction] = useFormState(getRizStats, {success: null, data: null});
  const [data, setData] = React.useState([])
  const [isLoading, setLoading] = React.useState(true)
  const fetchUsers = async () => {
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
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const rerender = React.useReducer(() => ({}), {})[1]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const thClass = "md:text-4xl w-[200px] font-bold p-2 border-b border-l border-indigo-700 text-left bg-indigo-700 text-white";
  const trClass = "md:text-4xl odd:bg-gray-100 hover:!bg-stone-200";
  const tdClass = "md:text-4xl p-2 border-b border-l text-left";
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>
  return (
    <div className="p-8 flex flex-col">
      <div>
        <form action={formAction}>
        <div className="flex flex-col">
          <div>
          <label htmlFor="start-date">Date de début:</label>
          <input type="date" name="start-date" />
          </div>
          <div>
          <label htmlFor="end-date">Date de fin:</label>
          <input type="date" name="end-date" />  
          </div>
          <div><SubmitButton /></div>
          <div>{formState.success}</div>
        </div>
        </form>
      </div>
      <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={thClass}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={trClass}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={tdClass}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
{/*        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>*/}
      </table>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
};

export default Tables;
