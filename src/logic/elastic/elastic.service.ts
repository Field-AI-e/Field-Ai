import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticService {
    private readonly headers: Record<string, string>;
    private readonly esUrl: string;
    constructor(private readonly configService: ConfigService) {
        this.esUrl = this.configService.get('ELASTIC_URL') || '';
        const esPass = this.configService.get('ELASTIC_API_KEY') || '';
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `APIKey ${esPass}`
        }

    }


    async elasticPost<T = any>(path: string, body: unknown): Promise<T> {
        const resp = await fetch(`${this.esUrl}${path}`, {
            method: "POST", 
            headers: this.headers,
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Elasticsearch error ${resp.status}: ${text}`);
        }
        return resp.json() as Promise<T>;
    }

    async elasticBulkSave(body: any[]) {
        const ndjson = body.map(line => JSON.stringify(line)).join("\n") + "\n";
        const resp = await fetch(`${this.esUrl}/_bulk`, {
          method: "POST",
          headers: this.headers,
          body: ndjson
        });
        const json = await resp.json();
        if (json.errors) {
          console.error("Elasticsearch bulk errors:", JSON.stringify(json, null, 2));
          throw new Error("Bulk insert failed");
        }
        return json;
      }

    async elasticDelete<T = any>(path: string): Promise<T> {
        const resp = await fetch(`${this.esUrl}${path}`, {
            method: "DELETE",
            headers: this.headers
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Elasticsearch delete error ${resp.status}: ${text}`);
        }
        return resp.json() as Promise<T>;
    }

    async elasticGet<T = any>(path: string): Promise<T> {
        const resp = await fetch(`${this.esUrl}${path}`, {
            method: "GET",
            headers: this.headers
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Elasticsearch get error ${resp.status}: ${text}`);
        }
        return resp.json() as Promise<T>;
    }

    async searchProductById(productId: string): Promise<any> {
        try {
            const response = await this.elasticPost('/khula_products/_search', {
                query: {
                    term: {
                        id: productId
                    }
                },
                size: 1
            });
            
            if (response.hits.hits.length > 0) {
                return response.hits.hits[0]._source;
            }
            return null;
        } catch (error) {
            console.error('Error searching product by ID:', error);
            throw error;
        }
    }

    async searchProductByName(productName: string): Promise<any> {
        try {
            const response = await this.elasticPost('/khula_products/_search', {
                query: {
                    bool: {
                        should: [
                            // Exact match (highest priority)
                            {
                                term: {
                                    name: {
                                        value: productName,
                                        boost: 3
                                    }
                                }
                            },
                            // Fuzzy search for typos and similar names
                            {
                                fuzzy: {
                                    name: {
                                        value: productName,
                                        fuzziness: "AUTO",
                                        boost: 2
                                    }
                                }
                            },
                            // Wildcard search for partial matches
                            {
                                wildcard: {
                                    name: {
                                        value: `*${productName}*`,
                                        boost: 1.5
                                    }
                                }
                            },
                            // Match phrase for better relevance
                            {
                                match_phrase: {
                                    name: {
                                        query: productName,
                                        boost: 2.5
                                    }
                                }
                            },
                            // Multi-match across different fields if they exist
                            {
                                multi_match: {
                                    query: productName,
                                    fields: ["name^3", "description^1", "category^2"],
                                    type: "best_fields",
                                    fuzziness: "AUTO",
                                    boost: 1
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                },
                size: 1, // Return top 5 results
                sort: [
                    { _score: { order: "desc" } }
                ]
            });
            
            if (response.hits.hits.length > 0) {
                // Return the best match (highest score)
                return response.hits.hits[0]._source;
            }
            return null;
        } catch (error) {
            console.error('Error searching product by name:', error);
            throw error;
        }
    }

    async searchProductsByNameFuzzy(productName: string, limit: number = 10): Promise<any[]> {
        try {
            const response = await this.elasticPost('/khula_products/_search', {
                query: {
                    bool: {
                        should: [
                            // Exact match (highest priority)
                            {
                                term: {
                                    name: {
                                        value: productName,
                                        boost: 3
                                    }
                                }
                            },
                            // Fuzzy search for typos and similar names
                            {
                                fuzzy: {
                                    name: {
                                        value: productName,
                                        fuzziness: "AUTO",
                                        boost: 2
                                    }
                                }
                            },
                            // Wildcard search for partial matches
                            {
                                wildcard: {
                                    name: {
                                        value: `*${productName}*`,
                                        boost: 1.5
                                    }
                                }
                            },
                            // Match phrase for better relevance
                            {
                                match_phrase: {
                                    name: {
                                        query: productName,
                                        boost: 2.5
                                    }
                                }
                            },
                            // Multi-match across different fields if they exist
                            {
                                multi_match: {
                                    query: productName,
                                    fields: ["name^3", "description^1", "category^2"],
                                    type: "best_fields",
                                    fuzziness: "AUTO",
                                    boost: 1
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                },
                size: limit,
                sort: [
                    { _score: { order: "desc" } }
                ]
            });
            
            return response.hits.hits.map(hit => ({
                ...hit._source,
                score: hit._score
            }));
        } catch (error) {
            console.error('Error searching products by name (fuzzy):', error);
            throw error;
        }
    }

}
