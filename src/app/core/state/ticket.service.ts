import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { Ticket, CreateTicketRequest, UpdateTicketRequest } from './ticket.models';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listTickets(organizationId: string): Observable<Ticket[]> {
    const url = joinUrl(this.baseUrl, '/api/tickets');
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.get<Ticket[]>(url, { params });
  }

  getTicket(id: string): Observable<Ticket> {
    const url = joinUrl(this.baseUrl, `/api/tickets/${id}`);
    return this.http.get<Ticket>(url);
  }

  createTicket(organizationId: string, body: CreateTicketRequest): Observable<Ticket> {
    const url = joinUrl(this.baseUrl, '/api/tickets');
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.post<Ticket>(url, body, { params });
  }

  updateTicket(id: string, body: UpdateTicketRequest): Observable<Ticket> {
    const url = joinUrl(this.baseUrl, `/api/tickets/${id}`);
    return this.http.put<Ticket>(url, body);
  }
}
