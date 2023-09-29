import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type Item = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  items: Item[];
};

const initialData: Column[] = [
  {
    id: 'column-1',
    title: 'To Do',
    items: [
      { id: 'item-1', content: 'Item 1' },
      { id: 'item-2', content: 'Item 2' },
    ],
  },
  {
    id: 'column-2',
    title: 'Done',
    items: [],
  },
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = columns.find(col => col.id === source.droppableId)!;
    const endColumn = columns.find(col => col.id === destination.droppableId)!;

    if (startColumn === endColumn) {
      const newItems = Array.from(startColumn.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newColumn = {
        ...startColumn,
        items: newItems,
      };

      setColumns(prev => prev.map(col => (col.id === newColumn.id ? newColumn : col)));
    } else {
      const startItems = Array.from(startColumn.items);
      const [removed] = startItems.splice(source.index, 1);

      const endItems = Array.from(endColumn.items);
      endItems.splice(destination.index, 0, removed);

      setColumns(prev => 
        prev.map(col => 
          col.id === startColumn.id ? { ...startColumn, items: startItems } :
          col.id === endColumn.id ? { ...endColumn, items: endItems } : 
          col
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {columns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  width: 240,
                  backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <h3>{column.title}</h3>
                {column.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: 8,
                          margin: '0 0 8px 0',
                          borderRadius: 4,
                          backgroundColor: snapshot.isDragging ? 'lightgreen' : 'grey',
                          color: 'white',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard