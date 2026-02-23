import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(
  to: string,
  resourceTitle: string,
  resourceUrl: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping approval email.");
    return { success: false, error: "Missing API key" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Shadcn Directory <onboarding@resend.dev>", 
      to: [to],
      subject: "Your submission has been approved! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f9fafb; margin: 0; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="padding: 32px; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">Submission Approved 🎉</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.5;">Great news!</p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">Your resource submission for <strong>${resourceTitle || resourceUrl}</strong> has been reviewed and approved by our team. It is now live on the directory.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resourceUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; font-weight: 500; font-size: 16px; text-decoration: none; padding: 12px 24px; border-radius: 6px;">View Resource</a>
              </div>
              
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.5;">Thanks for contributing to the community!</p>
              <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.5;">- The Shadcn Directory Team</p>
            </div>
            <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">You received this email because you submitted a resource to Shadcn Directory.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send approval email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending approval email:", error);
    return { success: false, error };
  }
}
