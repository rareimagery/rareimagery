/**
 * JSON:API filter builder.
 * Converts { field_x_handle: 'rareimagery', status: '1' }
 * into query params: filter[field_x_handle]=rareimagery&filter[status]=1
 */
export function buildJsonApiFilter(
  filters: Record<string, string | string[]>,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [field, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      params[`filter[${field}][operator]`] = 'IN';
      value.forEach((v, i) => {
        params[`filter[${field}][value][${i}]`] = v;
      });
    } else {
      params[`filter[${field}]`] = value;
    }
  }

  return params;
}

/**
 * Build include param for JSON:API relationships.
 * buildInclude('variations', 'field_product_category')
 * => { include: 'variations,field_product_category' }
 */
export function buildInclude(
  ...relationships: string[]
): Record<string, string> {
  return { include: relationships.join(',') };
}

interface JsonApiResource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<
    string,
    { data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null }
  >;
}

interface JsonApiResourceIdentifier {
  id: string;
  type: string;
}

interface JsonApiDocument {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  links?: Record<string, { href: string } | string>;
  meta?: Record<string, unknown>;
}

/**
 * Deserializes a JSON:API compound document into flat objects.
 * Resolves included relationships inline.
 */
export function deserializeJsonApi<T>(doc: JsonApiDocument): T[] {
  const includedMap = new Map<string, JsonApiResource>();
  doc.included?.forEach((res) => {
    includedMap.set(`${res.type}:${res.id}`, res);
  });

  const resources = Array.isArray(doc.data) ? doc.data : [doc.data];

  return resources.map((resource) => {
    const result: Record<string, unknown> = {
      uuid: resource.id,
      type: resource.type,
      ...resource.attributes,
    };

    if (resource.relationships) {
      for (const [key, rel] of Object.entries(resource.relationships)) {
        if (!rel.data) {
          result[key] = null;
        } else if (Array.isArray(rel.data)) {
          result[key] = rel.data
            .map((ref) => {
              const included = includedMap.get(`${ref.type}:${ref.id}`);
              return included
                ? { uuid: included.id, ...included.attributes }
                : { uuid: ref.id };
            });
        } else {
          const included = includedMap.get(`${rel.data.type}:${rel.data.id}`);
          result[key] = included
            ? { uuid: included.id, ...included.attributes }
            : { uuid: rel.data.id };
        }
      }
    }

    return result as T;
  });
}

/**
 * Build pagination params.
 */
export function buildPagination(
  offset: number,
  limit: number,
): Record<string, string> {
  return {
    'page[offset]': String(offset),
    'page[limit]': String(limit),
  };
}
