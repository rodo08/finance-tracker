import { useMemo, useState } from "react";
import {
  useFinancialRecords,
  FinancialRecord,
} from "../../contexts/financialRecordContext";
import { useTable, Column, CellProps } from "react-table";
import moment from "moment";
import Modal from "./Modal"; // Importa el componente Modal

// Definición de la interfaz para las propiedades del componente EditableCell
interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (
    rowIndex: number,
    columnId: string,
    value: string | number
  ) => void;
  editable: boolean;
}

// Componente EditableCell que permite editar valores en una celda
const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

// Componente principal que muestra la lista de registros financieros
export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null); // ID del registro a eliminar

  // Función para actualizar un registro específico
  const updateCellRecord = (
    rowIndex: number,
    columnId: string,
    value: string | number
  ) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

  // Definición de las columnas de la tabla
  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props: CellProps<FinancialRecord>) => {
          const date = props.value; // Fecha en formato ISO
          const formattedDate = moment(date)
            .locale("es")
            .format("DD [of] MMMM [of] YYYY, HH:mm");
          return (
            <EditableCell
              {...props}
              value={formattedDate} // Usa la fecha formateada
              updateRecord={updateCellRecord}
              editable={false}
            />
          );
        },
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setRecordToDelete(row.original._id ?? ""); // Guarda el ID del registro
              setIsModalOpen(true); // Abre el modal
            }}
            className="outline contrast"
          >
            Delete
          </button>
        ),
      },
    ],
    [records, updateRecord, deleteRecord]
  );

  // Configuración de la tabla usando react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (recordToDelete) {
      await deleteRecord(recordToDelete); // Elimina el registro
      setIsModalOpen(false); // Cierra el modal
      setRecordToDelete(null); // Resetea el ID del registro
    }
  };

  return (
    <div className="container-fluid overflow-auto">
      {/* Tabla */}
      <table {...getTableProps()} className="">
        <thead>
          {headerGroups.map((hg, headerGroupIndex) => (
            <tr
              {...hg.getHeaderGroupProps()}
              key={`${hg.id}-${headerGroupIndex}`}
            >
              {hg.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps()}
                  key={`${column.id}-${columnIndex}`}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => {
                  const cellProps = cell.getCellProps();
                  return (
                    <td {...cellProps} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
      />
    </div>
  );
};
