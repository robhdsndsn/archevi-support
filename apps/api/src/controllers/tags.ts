import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requirePermission } from "../lib/roles";
import { prisma } from "../prisma";

export function tagRoutes(fastify: FastifyInstance) {
  // List all tags
  fastify.get(
    "/api/v1/tags/all",
    {
      preHandler: requirePermission(["issue::read"]),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
      });

      reply.send({
        success: true,
        tags,
      });
    }
  );

  // Create a tag
  fastify.post(
    "/api/v1/tags/create",
    {
      preHandler: requirePermission(["issue::create"]),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, color }: any = request.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        reply.status(400).send({
          success: false,
          message: "Tag name is required",
        });
        return;
      }

      const tag = await prisma.tag.create({
        data: {
          name: name.trim(),
          color: color || "#6b7280",
        },
      });

      reply.send({
        success: true,
        tag,
      });
    }
  );

  // Update a tag
  fastify.put(
    "/api/v1/tags/:id",
    {
      preHandler: requirePermission(["issue::update"]),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const { name, color }: any = request.body;

      const tag = await prisma.tag.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(color && { color }),
        },
      });

      reply.send({
        success: true,
        tag,
      });
    }
  );

  // Delete a tag
  fastify.delete(
    "/api/v1/tags/:id",
    {
      preHandler: requirePermission(["issue::delete"]),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;

      await prisma.tag.delete({
        where: { id },
      });

      reply.send({
        success: true,
      });
    }
  );

  // Set tags on a ticket (replaces all existing tags)
  fastify.post(
    "/api/v1/ticket/:id/tags",
    {
      preHandler: requirePermission(["issue::update"]),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: any = request.params;
      const { tagIds }: any = request.body;

      const ticket = await prisma.ticket.update({
        where: { id },
        data: {
          tags: {
            set: (tagIds || []).map((tagId: string) => ({ id: tagId })),
          },
        },
        include: {
          tags: {
            select: { id: true, name: true, color: true },
          },
        },
      });

      reply.send({
        success: true,
        tags: ticket.tags,
      });
    }
  );
}
