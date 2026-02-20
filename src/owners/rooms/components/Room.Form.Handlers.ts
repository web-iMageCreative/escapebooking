import { RoomModel, Price, Schedule, RoomFormError } from '../Room.Model';
import dayjs from 'dayjs';

export class RoomFormHandlers {
  
  static handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data: RoomModel,
    setData: React.Dispatch<React.SetStateAction<RoomModel>>
  ) {
    let { id, value } = e.target;
    
    if (id === "duration" || id === "min_players" || id === "max_players") {
      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
      value = onlyNums;
    }

    if (id === "min_players" || id === "max_players") {
      let players: number = Number(value);
      if (players > 20) {
        value = '20';
      }
      value = players.toString();
    }

    setData({
      ...data,
      [id]: value
    });
  }

  static handlePriceChange(
    e: React.ChangeEvent<HTMLInputElement>,
    data: RoomModel,
    setData: React.Dispatch<React.SetStateAction<RoomModel>>
  ) {
    let value: string = e.target.value;
    let point: RegExpMatchArray | null;
    let parts: string[];
    let price: number | string;

    if (value === '') {
      value = '0';
    } else {
      value = value.replace(',','.');
      value = value.replace(/[^0-9.]/g, '');
      point = value.match(/\./g);
      parts = value.split('.');

      if (point && point.length > 1) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0,2);
      }
    }
    
    if (value.endsWith('.') || value.endsWith('0')) {
      price = value;
    } else {
      price = parseFloat(value);
    }

    const index: number = parseInt(e.target.dataset.index!);
    const min: number = data.min_players;
    const newPrices: Price[] = Object.assign([], data.prices);

    newPrices[index] = { id_room: 0, num_players: +min + +index, price: price };

    setData(({
      ...data,
      prices: newPrices
    }));
  }

  static handleDayChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setDay: React.Dispatch<React.SetStateAction<number>>
  ) {
    setDay(Number(e.target.value));
  }

  static handleHourChange(
    value: dayjs.Dayjs | null,
    setHour: React.Dispatch<React.SetStateAction<Date>>
  ) {
    setHour(new Date(0, 0, 0, value?.get('hour'), value?.get('minute')));
  }

  static handleAddSchedule(
    initialData: RoomModel,
    day: number,
    hour: Date,
    schedules: Schedule[],
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>,
    orderedSchedules: any,
    setOrderedSchedules: React.Dispatch<React.SetStateAction<any>>
  ) {
    let s: Schedule[] = [...schedules, {
      id_room: initialData.id,
      day_week: day,
      hour: hour,
      strHour: new Intl.DateTimeFormat("es-ES", { hour: 'numeric', minute: 'numeric' }).format(hour.getTime())
    }];

    s = this.sortSchedule(s);

    for (let i = 0; i <= 6; i++) {
      orderedSchedules[i] = s.filter(obj => obj.day_week === i);
    }

    setOrderedSchedules([...orderedSchedules]);
    setSchedules(s);
  }

  static handleDeleteHour(
    i: number,
    j: number,
    orderedSchedules: any,
    schedules: Schedule[],
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>,
    setOrderedSchedules: React.Dispatch<React.SetStateAction<any>>
  ) {
    const id_room = orderedSchedules[i][j]['id_room'];
    const day_week = orderedSchedules[i][j]['day_week'];
    const hour = orderedSchedules[i][j]['hour'];
    const s = schedules.filter((schedule) => {
      return !(schedule.id_room === id_room && schedule.day_week === day_week && schedule.hour === hour);
    });
    setSchedules(s);

    delete orderedSchedules[i][j];
    setOrderedSchedules([...orderedSchedules]);
  }

  static sortSchedule(s: Schedule[]) {
    const result: Schedule[] = s.sort((a, b) => {
      return a.hour.getTime() - b.hour.getTime();
    });
    return result;
  }
}