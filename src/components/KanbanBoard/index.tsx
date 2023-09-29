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

const initialData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      itemsIds: ['item-1', 'item-2']
    },
    'column-2': {
      id: 'column-2',
      title: 'Done',
      itemsIds: []
    }
  },
  items: {
    'item-1': { id: 'item-1', content: 'Item 1' },
    'item-2': { id: 'item-2', content: 'Item 2' }
  },
  columnOrder: ['column-1', 'column-2']
};

const KanbanBoard: React.FC = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newItemsIds = Array.from(startColumn.itemsIds);
      newItemsIds.splice(source.index, 1);
      newItemsIds.splice(destination.index, 0, result.draggableId);

      const newColumn = {
        ...startColumn,
        itemsIds: newItemsIds
      };

      setData(prevData => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newColumn.id]: newColumn
        }
      }));
    } else {
      const startItemsIds = Array.from(startColumn.itemsIds);
      startItemsIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        itemsIds: startItemsIds
      };

      const endItemsIds = Array.from(endColumn.itemsIds);
      endItemsIds.splice(destination.index, 0, result.draggableId);
      const newEndColumn = {
        ...endColumn,
        itemsIds: endItemsIds
      };

      setData(prevData => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn
        }
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const items = column.itemsIds.map(itemId => data.items[itemId]);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    width: 240,
                    backgroundColor: 'lightgrey',
                    padding: 8,
                    borderRadius: 4
                  }}
                >
                  <h3>{column.title}</h3>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: 8,
                            margin: '0 0 8px 0',
                            borderRadius: 4,
                            backgroundColor: 'grey',
                            color: 'white',
                            ...provided.draggableProps.style
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
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard