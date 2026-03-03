import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import moment from "moment";
import { MessageSquare } from "lucide-react";
import { getPriorityColor, getTypeColor, normalizePriority } from "../../lib/ticket-utils";

interface TicketRowProps {
  ticket: any;
}

export default function TicketRow({ ticket }: TicketRowProps) {
  const { t } = useTranslation("peppermint");
  const commentCount = ticket._count?.Comment ?? 0;

  return (
    <Link href={`/issue/${ticket.id}`}>
      <div className="flex flex-row w-full bg-card dark:bg-background dark:hover:bg-muted border-b-[1px] p-1.5 justify-between px-6 hover:bg-muted">
        <div className="flex flex-row items-center space-x-4">
          <span className="text-xs font-semibold">
            #{ticket.Number}
          </span>
          <span className="text-xs font-semibold">
            {ticket.title}
          </span>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xs">
              {moment(ticket.createdAt).format("DD/MM/yyyy")}
            </span>
            {commentCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground" title={`${commentCount} comment${commentCount !== 1 ? "s" : ""}`}>
                <MessageSquare className="h-3 w-3" />
                {commentCount}
              </span>
            )}
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 capitalize justify-center w-20 text-xs font-medium ring-1 ring-inset ${getTypeColor(ticket.type)}`}
            >
              {ticket.type}
            </span>
          </div>
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {ticket.tags.slice(0, 2).map((tag: any) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ring-gray-500/10"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {ticket.tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground">
                  +{ticket.tags.length - 2}
                </span>
              )}
            </div>
          )}
          <div>
            {ticket.isComplete === true ? (
              <div>
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 w-20 justify-center py-1 text-xs ring-1 ring-inset ring-gray-500/10 font-medium text-red-700">
                  <svg
                    className="h-1.5 w-1.5 fill-red-500"
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                  >
                    <circle cx={3} cy={3} r={3} />
                  </svg>
                  {t("closed")}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-x-1.5 rounded-md w-20 justify-center font-medium bg-green-100 ring-1 ring-inset ring-gray-500/10 px-2 py-1 text-xs text-green-700">
                <svg
                  className="h-1.5 w-1.5 fill-green-500"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx={3} cy={3} r={3} />
                </svg>
                {t("open")}
              </span>
            )}
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 capitalize justify-center w-20 text-xs font-medium ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}
            >
              {normalizePriority(ticket.priority)}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground shrink-0">
              <span className="text-[11px] font-medium leading-none text-white uppercase">
                {ticket.assignedTo
                  ? ticket.assignedTo.name[0]
                  : "?"}
              </span>
            </span>
            <span className="text-xs text-muted-foreground max-w-[100px] truncate">
              {ticket.assignedTo
                ? ticket.assignedTo.name
                : <span className="italic">Unassigned</span>}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
