<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Confirmation</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 100%;
            margin: 0;
            background-color: #ffffff;
            padding: 32px;
            box-sizing: border-box;
        }

        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
        }

        h1 {
            color: #0f172a;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px;
        }

        .ticket-info {
            background-color: #ffffff;
            border-radius: 12px;
            margin: 24px 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .ticket-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
        }

        .ticket-table th {
            background-color: rgba(248, 250, 252, 0.8);
            color: #3b82f6;
            font-weight: 600;
            text-align: left;
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            width: 30%;
            font-size: 14px;
        }

        .ticket-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            color: #0f172a;
            font-size: 14px;
            line-height: 1.5;
        }

        .ticket-table tr:last-child th,
        .ticket-table tr:last-child td {
            border-bottom: none;
        }

        .ticket-table tr:hover {
            background-color: #f8fafc;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 500;
            background-color: #fef2f2;
            color: #991b1b;
        }

        .status-open {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .status-closed {
            background-color: #dcfce7;
            color: #166534;
        }

        .message {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }

        .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }

        .footer a {
            color: #3b82f6;
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .footer a:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }

        @media only screen and (max-width: 600px) {
            .container {
                padding: 16px;
            }

            .ticket-table th,
            .ticket-table td {
                padding: 12px 16px;
                font-size: 13px;
            }

            .ticket-table th {
                width: 35%;
            }

            h1 {
                font-size: 20px;
            }

            .priority-chip {
                font-size: 12px;
                padding: 4px 8px;
            }
        }

        /* Priority Styles */
        .priority-chip {
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 14px;
            display: inline-block;
            text-transform: capitalize;
        }

        .priority-low {
            background-color: #a5d6a7;
            color: #000;
        }

        .priority-medium {
            background-color: #fff59d;
            color: #000;
        }

        .priority-high {
            background-color: #ef9a9a;
            color: #000;
        }

        .priority-critical {
            background-color: #ef5350;
            color: #fff;
        }

        /* Info Alert Styles */
        .info-alert {
            background-color: #e0f2f7;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            text-align: center;
            width: fit-content;
            max-width: 100%;
        }

        .info-alert-icon {
            background-color: #3b82f6;
            color: #ffffff;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
            line-height: 22px;
            font-family: Arial, sans-serif;
            text-align: center;
            vertical-align: middle;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .info-alert-text {
            color: #01579b;
            font-size: 13px;
            margin: 0;
            font-weight: 500;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Hi, {{ $full_name }}!</h1>
            <p>Thank you for submitting a support ticket. Here are your ticket details:</p>
            <div style="text-align: center; margin: 16px 0;">
                <div class="info-alert">
                    <div class="info-alert-icon">i</div>
                    <p class="info-alert-text">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </div>

        <!-- TICKET DETAILS -->
        <div class="ticket-info">
            <table class="ticket-table">
                <tbody>
                    <!-- DATE CREATED -->
                    <tr>
                        <th>📅 Date Reported</th>
                        <td>{{ date('M. d, Y h:i A', strtotime($created_at)) }}</td>
                    </tr>

                    <!-- REPORTED BY -->
                    <tr>
                        <th>👤 Reported By</th>
                        <td>{{ $full_name }}</td>
                    </tr>

                    <!-- EMAIL -->
                    <tr>
                        <th>📧 Email</th>
                        <td>{{ $email }}</td>
                    </tr>



                    <!-- TICKET NUMBER -->
                    <tr>
                        <th>🎫 Ticket Number</th>
                        <td><strong>{{ $ticket_number }}</strong></td>
                    </tr>

                    <!-- PRIORITY -->
                    <tr>
                        <th>⚡ Priority</th>
                        <td>
                            <span class="priority-chip priority-{{ strtolower($priority) }}">{{ $priority }}</span>
                        </td>
                    </tr>

                    <!-- PROBLEM ENCOUNTERED -->
                    <tr>
                        <th>⚠️ Problem Category</th>
                        <td>{{ $category_name }}</td>
                    </tr>

                    <!-- SERVICE CENTER -->
                    <tr>
                        <th>🏢 Service Center</th>
                        <td>{{ $service_center_name }}</td>
                    </tr>

                    <!-- SYSTEM -->
                    <tr>
                        <th>💻 System</th>
                        <td>{{ $system_name }}</td>
                    </tr>

                    <!-- DESCRIPTION -->
                    <tr>
                        <th>📝 Description</th>
                        <td>{{ $description }}</td>
                    </tr>

                    <!-- ATTACHMENT -->
                    <tr>
                        <th>📎 Attachment</th>
                        <td>
                            @if($attachments && $attachments->count() > 0)
                                @foreach($attachments as $attachment)
                                    <a href="{{ url('/attachment/' . $attachment->uuid) }}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 500; display: block; margin-bottom: 8px;">
                                        📄 {{ $attachment->original_name }}
                                    </a>
                                @endforeach
                                <small style="color: #64748b; font-size: 12px;">Click to view attachment(s)</small>
                            @else
                                <span style="color: #64748b; font-style: italic;">No attachment provided</span>
                            @endif
                        </td>
                    </tr>

                    <!-- STATUS -->
                    <tr>
                        <th>📊 Status</th>
                        <td>
                            <span class="status-badge">
                                Pending
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- MESSAGE -->
        <div class="message">
            Our team will review your ticket and get back to you as soon as possible. Please keep your ticket number for future reference.
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Best regards,<br>Research and Development</p>
            <p><small>&copy; {{ date('Y') }} <a href="https://apsoft.com.ph/" target="_blank">Apsoft Inc.</a> | <a href="https://phillogix.site/" target="_blank">Phillogix Systems</a> | <a href="https://ideaserv.site/" target="_blank">ideaserv Systems, Inc.</a><br>
                    <a href="{{ $support_portal_link }}" target="_blank">Access Support Portal</a></small></p>
        </div>
    </div>
</body>

</html>
