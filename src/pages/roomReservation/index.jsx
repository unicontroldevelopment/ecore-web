import { Button, Form, Input, Modal, Select, TimePicker, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Utils from "../../services/Utils";

const { Option } = Select;
const { RangePicker } = TimePicker;
const localizer = momentLocalizer(moment);

function RoomReservation() {
  const service = new Utils();
  const [rooms] = useState([
    { id: 1, name: "Sala VIP" },
    { id: 2, name: "Aquário" },
  ]);
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [form] = Form.useForm();

  useEffect(() => {
    // Simular busca de reservas existentes
    const mockEvents = [
      {
        id: 1,
        title: "Reserva - Sala VIP",
        start: new Date(2024, 9, 25, 10, 0),
        end: new Date(2024, 9, 25, 11, 0),
        room: rooms[0],
      },
      {
        id: 2,
        title: "Reserva - Aquário",
        start: new Date(2024, 10, 25, 14, 0),
        end: new Date(2024, 10, 25, 15, 0),
        room: rooms[1],
      },
    ];
    setEvents(mockEvents);
  }, []);

  const DnDCalendar = withDragAndDrop(Calendar);

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setEvents(updatedEvents);
    message.success("Reserva reordenada com sucesso!");
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsModalVisible(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
    form.setFieldsValue({
      room: event.room.id,
      timeRange: [moment(event.start), moment(event.end)],
    });
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
    form.resetFields();
  };

  const handleReservation = (values) => {
    const { room, timeRange, description } = values;
    const selectedRoom = rooms.find((r) => r.id === room);

    const startTime = moment(selectedDate)
      .set({
        hour: timeRange[0].hour(),
        minute: timeRange[0].minute(),
        second: 0,
        millisecond: 0,
      })
      .toDate();

    const endTime = moment(selectedDate)
      .set({
        hour: timeRange[1].hour(),
        minute: timeRange[1].minute(),
        second: 0,
        millisecond: 0,
      })
      .toDate();

    const newEvent = {
      id: selectedEvent ? selectedEvent.id : events.length + 1,
      title: `Reserva - ${selectedRoom.name}`,
      start: startTime,
      end: endTime,
      room: selectedRoom,
      description: description,
    };

    console.log("New Event:", newEvent);

    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? newEvent : event
      );
      setEvents(updatedEvents);
      message.success("Reserva atualizada com sucesso!");
    } else {
      setEvents([...events, newEvent]);
      message.success("Nova reserva criada com sucesso!");
    }
    setIsModalVisible(false);
    setSelectedEvent(null);
    form.resetFields();
  };
  const formats = {
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
  };

  const EventComponent = ({ event, view }) => {
    console.log(view);

    switch (view) {
      case "month":
        return (
          <div>
            <strong>{event.title}</strong>
          </div>
        );
      case "week":
      case "day":
        console.log("Aqui");

        return (
          <div>
            <strong>{event.title}</strong>
            <br />
            {event.description}
          </div>
        );
      default:
        return (
          <div>
            <strong>{event.title}</strong>
          </div>
        );
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(updatedEvents);
      setIsModalVisible(false);
      setSelectedEvent(null);
      form.resetFields();
      message.success("Reserva excluída com sucesso!");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <h1>Reserva de Salas</h1>
      <DnDCalendar
        localizer={localizer}
        events={events}
        onEventDrop={handleEventDrop}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100% - 100px)" }}
        selectable
        view={currentView}
        onView={setCurrentView}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        formats={formats}
        components={{
          event: (props) => <EventComponent {...props} view={currentView} />,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.room.id === 1 ? "#3174ad" : "#ad4331",
          },
        })}
      />
      <Modal
        title={selectedEvent ? "Editar Reserva" : "Nova Reserva"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleReservation}>
          <Form.Item
            name="room"
            label="Sala"
            rules={[
              { required: true, message: "Por favor, selecione uma sala" },
            ]}
          >
            <Select>
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="Horário"
            rules={[
              { required: true, message: "Por favor, selecione o horário" },
            ]}
          >
            <RangePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              { required: true, message: "Por favor, adicione uma descrição" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedEvent ? "Atualizar" : "Reservar"}
            </Button>
            {selectedEvent && (
              <Button
                type="danger"
                onClick={handleDeleteEvent}
                style={{ marginLeft: 10 }}
              >
                Excluir
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RoomReservation;
