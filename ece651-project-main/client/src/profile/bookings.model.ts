export type Booking = {
  start_date: string;
  end_date: string;
  room_id: string;
  status: string;
  public_id: string;
};

export type Pictures = string[] | null;

export type Unit = {
  public_id: string;
  name: string;
  building: string;
};

export type BookingResponse = {
  bookings: Booking;
  units: Unit;
  pictures: Pictures;
  property_name: string;
}[];

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  verified_email: boolean;
};
