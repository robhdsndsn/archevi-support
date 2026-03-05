import handlebars from "handlebars";
import { prisma } from "../../../prisma";
import { createTransportProvider } from "../transport";

export async function sendTicketCreate(ticket: any) {
  try {
    const email = await prisma.email.findFirst();

    if (email) {
      const transport = await createTransportProvider();

      const testhtml = await prisma.emailTemplate.findFirst({
        where: {
          type: "ticket_created",
        },
      });

      var template = handlebars.compile(testhtml?.html);

      // Parse detail back from JSON string if needed
      let description = ticket.detail || '';
      try {
        const parsed = JSON.parse(description);
        if (typeof parsed === 'object' && parsed.content) {
          // Tiptap JSON - extract text
          description = parsed.content
            .map((block: any) => block.content?.map((c: any) => c.text).join('') || '')
            .join('\n');
        } else if (typeof parsed === 'string') {
          description = parsed;
        }
      } catch {
        // Already plain text
      }

      var replacements = {
        id: ticket.id,
        title: ticket.title || `Ticket #${ticket.id}`,
        description,
      };
      var htmlToSend = template(replacements);

      await transport
        .sendMail({
          from: email?.reply,
          to: ticket.email,
          subject: `Issue #${ticket.id} has just been created & logged`,
          text: `Hello there, Issue #${ticket.id}, which you reported on ${ticket.createdAt}, has now been created and logged`,
          html: htmlToSend,
        })
        .then((info: any) => {
          console.log("Message sent: %s", info.messageId);
        })
        .catch((err: any) => console.log(err));
    }
  } catch (error) {
    console.log(error);
  }
}
