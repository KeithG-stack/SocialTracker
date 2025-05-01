'use client';

import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function DashboardCustomizer() {
  const [widgets, setWidgets] = useState([
    { id: '1', type: 'engagement' },
    { id: '2', type: 'followers' },
    { id: '3', type: 'content' }
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="widgets">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                className="bg-white p-6 rounded-lg shadow"
              >
                {widget.type === 'engagement' && <h3>Engagement Metrics</h3>}
                {widget.type === 'followers' && <h3>Follower Growth</h3>}
                {widget.type === 'content' && <h3>Content Overview</h3>}
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}