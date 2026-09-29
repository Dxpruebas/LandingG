export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      angulos: {
        Row: {
          created_at: string
          dolor: string | null
          elegido: boolean
          etiquetas: string[]
          gancho: string | null
          id: string
          marca_id: string
          orden: number
          producto_id: string
          promesa: string | null
          publico: string | null
          titular: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dolor?: string | null
          elegido?: boolean
          etiquetas?: string[]
          gancho?: string | null
          id?: string
          marca_id: string
          orden?: number
          producto_id: string
          promesa?: string | null
          publico?: string | null
          titular: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dolor?: string | null
          elegido?: boolean
          etiquetas?: string[]
          gancho?: string | null
          id?: string
          marca_id?: string
          orden?: number
          producto_id?: string
          promesa?: string | null
          publico?: string | null
          titular?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "angulos_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      campanas: {
        Row: {
          anuncio: Json
          created_at: string
          creativo_ids: string[]
          estado: string
          id: string
          id_externo: string | null
          link_destino: string | null
          marca_id: string
          moneda: string
          nombre: string
          objetivo: string | null
          plataforma: string
          presupuesto_diario: number | null
          producto_id: string | null
          segmentacion: Json
          updated_at: string
        }
        Insert: {
          anuncio?: Json
          created_at?: string
          creativo_ids?: string[]
          estado?: string
          id?: string
          id_externo?: string | null
          link_destino?: string | null
          marca_id: string
          moneda?: string
          nombre: string
          objetivo?: string | null
          plataforma: string
          presupuesto_diario?: number | null
          producto_id?: string | null
          segmentacion?: Json
          updated_at?: string
        }
        Update: {
          anuncio?: Json
          created_at?: string
          creativo_ids?: string[]
          estado?: string
          id?: string
          id_externo?: string | null
          link_destino?: string | null
          marca_id?: string
          moneda?: string
          nombre?: string
          objetivo?: string | null
          plataforma?: string
          presupuesto_diario?: number | null
          producto_id?: string | null
          segmentacion?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanas_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      claves_api: {
        Row: {
          created_at: string
          hash: string
          id: string
          nombre: string
          prefijo: string
          revocada_en: string | null
          ultimo_uso_en: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string
          hash: string
          id?: string
          nombre: string
          prefijo: string
          revocada_en?: string | null
          ultimo_uso_en?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string
          hash?: string
          id?: string
          nombre?: string
          prefijo?: string
          revocada_en?: string | null
          ultimo_uso_en?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claves_api_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      creativos: {
        Row: {
          angulo_id: string | null
          created_at: string
          favorito: boolean
          formato: string
          id: string
          imagen_ruta: string | null
          lote_id: string | null
          marca_id: string
          nombre: string | null
          producto_id: string
          resultados: Json | null
          textos: Json
          updated_at: string
          veredicto: string | null
        }
        Insert: {
          angulo_id?: string | null
          created_at?: string
          favorito?: boolean
          formato: string
          id?: string
          imagen_ruta?: string | null
          lote_id?: string | null
          marca_id: string
          nombre?: string | null
          producto_id: string
          resultados?: Json | null
          textos?: Json
          updated_at?: string
          veredicto?: string | null
        }
        Update: {
          angulo_id?: string | null
          created_at?: string
          favorito?: boolean
          formato?: string
          id?: string
          imagen_ruta?: string | null
          lote_id?: string | null
          marca_id?: string
          nombre?: string | null
          producto_id?: string
          resultados?: Json | null
          textos?: Json
          updated_at?: string
          veredicto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creativos_angulo_id_fkey"
            columns: ["angulo_id"]
            isOneToOne: false
            referencedRelation: "angulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creativos_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_prueba"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creativos_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      cupones: {
        Row: {
          activo: boolean
          codigo: string
          created_at: string
          id: string
          tipo: string
          usos_maximos: number | null
          valor: number
          vence_en: string | null
        }
        Insert: {
          activo?: boolean
          codigo: string
          created_at?: string
          id?: string
          tipo: string
          usos_maximos?: number | null
          valor: number
          vence_en?: string | null
        }
        Update: {
          activo?: boolean
          codigo?: string
          created_at?: string
          id?: string
          tipo?: string
          usos_maximos?: number | null
          valor?: number
          vence_en?: string | null
        }
        Relationships: []
      }
      cupones_usos: {
        Row: {
          created_at: string
          cupon_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          cupon_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          cupon_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cupones_usos_cupon_id_fkey"
            columns: ["cupon_id"]
            isOneToOne: false
            referencedRelation: "cupones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupones_usos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_landing: {
        Row: {
          created_at: string
          id: number
          landing_id: string
          marca_id: string
          referer: string | null
          tipo: string
          utm: Json | null
          visitante_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          landing_id: string
          marca_id: string
          referer?: string | null
          tipo: string
          utm?: Json | null
          visitante_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          landing_id?: string
          marca_id?: string
          referer?: string | null
          tipo?: string
          utm?: Json | null
          visitante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_landing_landing_id_marca_id_fkey"
            columns: ["landing_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "landings"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      generaciones: {
        Row: {
          accion: string
          costo_ia_usd: number
          created_at: string
          creditos: number
          entrada: Json
          error: string | null
          estado: string
          finalizada_en: string | null
          id: string
          iniciada_en: string | null
          intentos: number
          marca_id: string
          origen: string
          producto_id: string | null
          realizado_por: string | null
          resultado: Json | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          accion: string
          costo_ia_usd?: number
          created_at?: string
          creditos: number
          entrada?: Json
          error?: string | null
          estado?: string
          finalizada_en?: string | null
          id?: string
          iniciada_en?: string | null
          intentos?: number
          marca_id: string
          origen?: string
          producto_id?: string | null
          realizado_por?: string | null
          resultado?: Json | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          accion?: string
          costo_ia_usd?: number
          created_at?: string
          creditos?: number
          entrada?: Json
          error?: string | null
          estado?: string
          finalizada_en?: string | null
          id?: string
          iniciada_en?: string | null
          intentos?: number
          marca_id?: string
          origen?: string
          producto_id?: string | null
          realizado_por?: string | null
          resultado?: Json | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generaciones_accion_fkey"
            columns: ["accion"]
            isOneToOne: false
            referencedRelation: "precios_acciones"
            referencedColumns: ["accion"]
          },
          {
            foreignKeyName: "generaciones_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generaciones_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generaciones_realizado_por_fkey"
            columns: ["realizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      imagenes_producto: {
        Row: {
          created_at: string
          es_principal: boolean
          id: string
          marca_id: string
          orden: number
          producto_id: string
          ruta_storage: string
        }
        Insert: {
          created_at?: string
          es_principal?: boolean
          id?: string
          marca_id: string
          orden?: number
          producto_id: string
          ruta_storage: string
        }
        Update: {
          created_at?: string
          es_principal?: boolean
          id?: string
          marca_id?: string
          orden?: number
          producto_id?: string
          ruta_storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "imagenes_producto_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      integraciones: {
        Row: {
          conectada_en: string | null
          config: Json
          created_at: string
          estado: string
          id: string
          marca_id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          conectada_en?: string | null
          config?: Json
          created_at?: string
          estado?: string
          id?: string
          marca_id: string
          tipo: string
          updated_at?: string
        }
        Update: {
          conectada_en?: string | null
          config?: Json
          created_at?: string
          estado?: string
          id?: string
          marca_id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integraciones_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      integraciones_secretos: {
        Row: {
          credenciales: Json
          integracion_id: string
          updated_at: string
        }
        Insert: {
          credenciales: Json
          integracion_id: string
          updated_at?: string
        }
        Update: {
          credenciales?: Json
          integracion_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integraciones_secretos_integracion_id_fkey"
            columns: ["integracion_id"]
            isOneToOne: true
            referencedRelation: "integraciones"
            referencedColumns: ["id"]
          },
        ]
      }
      landings: {
        Row: {
          angulo_id: string | null
          config: Json
          created_at: string
          dominio_propio: string | null
          estado: string
          estilo: string | null
          id: string
          marca_id: string
          producto_id: string
          publicada_en: string | null
          updated_at: string
          variante: string
          version_actual: number
        }
        Insert: {
          angulo_id?: string | null
          config?: Json
          created_at?: string
          dominio_propio?: string | null
          estado?: string
          estilo?: string | null
          id?: string
          marca_id: string
          producto_id: string
          publicada_en?: string | null
          updated_at?: string
          variante?: string
          version_actual?: number
        }
        Update: {
          angulo_id?: string | null
          config?: Json
          created_at?: string
          dominio_propio?: string | null
          estado?: string
          estilo?: string | null
          id?: string
          marca_id?: string
          producto_id?: string
          publicada_en?: string | null
          updated_at?: string
          variante?: string
          version_actual?: number
        }
        Relationships: [
          {
            foreignKeyName: "landings_angulo_id_fkey"
            columns: ["angulo_id"]
            isOneToOne: false
            referencedRelation: "angulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landings_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      lotes_prueba: {
        Row: {
          config: Json
          created_at: string
          estado: string
          id: string
          marca_id: string
          nombre: string
          producto_id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          estado?: string
          id?: string
          marca_id: string
          nombre: string
          producto_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          estado?: string
          id?: string
          marca_id?: string
          nombre?: string
          producto_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotes_prueba_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      marcas: {
        Row: {
          color_primario: string | null
          created_at: string
          id: string
          logo_url: string | null
          nombre: string
          propietario_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          color_primario?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nombre: string
          propietario_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          color_primario?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nombre?: string
          propietario_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marcas_propietario_id_fkey"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      miembros_marca: {
        Row: {
          created_at: string
          marca_id: string
          rol: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          marca_id: string
          rol: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          marca_id?: string
          rol?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miembros_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_marca_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_creditos: {
        Row: {
          bolsillo: string
          cantidad: number
          created_at: string
          generacion_id: string | null
          id: string
          marca_id: string | null
          motivo: string | null
          pago_id: string | null
          realizado_por: string | null
          tipo: string
          usuario_id: string
          vence_en: string | null
        }
        Insert: {
          bolsillo: string
          cantidad: number
          created_at?: string
          generacion_id?: string | null
          id?: string
          marca_id?: string | null
          motivo?: string | null
          pago_id?: string | null
          realizado_por?: string | null
          tipo: string
          usuario_id: string
          vence_en?: string | null
        }
        Update: {
          bolsillo?: string
          cantidad?: number
          created_at?: string
          generacion_id?: string | null
          id?: string
          marca_id?: string | null
          motivo?: string | null
          pago_id?: string | null
          realizado_por?: string | null
          tipo?: string
          usuario_id?: string
          vence_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_creditos_generacion_id_fkey"
            columns: ["generacion_id"]
            isOneToOne: false
            referencedRelation: "generaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_creditos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_creditos_pago_id_fkey"
            columns: ["pago_id"]
            isOneToOne: false
            referencedRelation: "pagos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_creditos_realizado_por_fkey"
            columns: ["realizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_creditos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          activo: boolean
          created_at: string
          creditos: number
          id: string
          nombre: string
          orden: number
          precio_usd: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          creditos: number
          id: string
          nombre: string
          orden?: number
          precio_usd: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          creditos?: number
          id?: string
          nombre?: string
          orden?: number
          precio_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      pagos: {
        Row: {
          concepto: string
          created_at: string
          datos: Json | null
          estado: string
          id: string
          id_externo: string
          monto_usd: number
          pack_id: string | null
          plan_id: string | null
          proveedor: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          concepto: string
          created_at?: string
          datos?: Json | null
          estado: string
          id?: string
          id_externo: string
          monto_usd: number
          pack_id?: string | null
          plan_id?: string | null
          proveedor: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          concepto?: string
          created_at?: string
          datos?: Json | null
          estado?: string
          id?: string
          id_externo?: string
          monto_usd?: number
          pack_id?: string | null
          plan_id?: string | null
          proveedor?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          acepto_tratamiento_datos: boolean
          barrio: string | null
          cantidad: number
          ciudad: string
          cliente_nombre: string
          created_at: string
          departamento: string
          direccion: string
          dropi_pedido_id: string | null
          estado: string
          id: string
          ip_hash: string | null
          landing_id: string | null
          marca_id: string
          moneda: string
          notas: string | null
          numero: number
          producto_id: string | null
          producto_nombre: string
          telefono: string
          total: number
          updated_at: string
        }
        Insert: {
          acepto_tratamiento_datos: boolean
          barrio?: string | null
          cantidad: number
          ciudad: string
          cliente_nombre: string
          created_at?: string
          departamento: string
          direccion: string
          dropi_pedido_id?: string | null
          estado?: string
          id?: string
          ip_hash?: string | null
          landing_id?: string | null
          marca_id: string
          moneda?: string
          notas?: string | null
          numero?: never
          producto_id?: string | null
          producto_nombre: string
          telefono: string
          total: number
          updated_at?: string
        }
        Update: {
          acepto_tratamiento_datos?: boolean
          barrio?: string | null
          cantidad?: number
          ciudad?: string
          cliente_nombre?: string
          created_at?: string
          departamento?: string
          direccion?: string
          dropi_pedido_id?: string | null
          estado?: string
          id?: string
          ip_hash?: string | null
          landing_id?: string | null
          marca_id?: string
          moneda?: string
          notas?: string | null
          numero?: never
          producto_id?: string | null
          producto_nombre?: string
          telefono?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_landing_id_fkey"
            columns: ["landing_id"]
            isOneToOne: false
            referencedRelation: "landings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      planes: {
        Row: {
          activo: boolean
          created_at: string
          creditos_mes: number
          etiqueta: string | null
          id: string
          nombre: string
          orden: number
          precio_anual_usd: number
          precio_mensual_usd: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          creditos_mes: number
          etiqueta?: string | null
          id: string
          nombre: string
          orden?: number
          precio_anual_usd: number
          precio_mensual_usd: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          creditos_mes?: number
          etiqueta?: string | null
          id?: string
          nombre?: string
          orden?: number
          precio_anual_usd?: number
          precio_mensual_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      precios_acciones: {
        Row: {
          accion: string
          activo: boolean
          creditos: number
          nombre: string
          updated_at: string
        }
        Insert: {
          accion: string
          activo?: boolean
          creditos: number
          nombre: string
          updated_at?: string
        }
        Update: {
          accion?: string
          activo?: boolean
          creditos?: number
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          analisis: Json | null
          creado_por: string | null
          created_at: string
          descripcion_corta: string | null
          dropi_producto_id: string | null
          estado: string
          id: string
          marca_id: string
          moneda: string
          nombre: string
          origen: string
          precio: number | null
          precio_tachado: number | null
          publico_objetivo: string | null
          slug: string
          updated_at: string
          url_origen: string | null
        }
        Insert: {
          analisis?: Json | null
          creado_por?: string | null
          created_at?: string
          descripcion_corta?: string | null
          dropi_producto_id?: string | null
          estado?: string
          id?: string
          marca_id: string
          moneda?: string
          nombre: string
          origen: string
          precio?: number | null
          precio_tachado?: number | null
          publico_objetivo?: string | null
          slug: string
          updated_at?: string
          url_origen?: string | null
        }
        Update: {
          analisis?: Json | null
          creado_por?: string | null
          created_at?: string
          descripcion_corta?: string | null
          dropi_producto_id?: string | null
          estado?: string
          id?: string
          marca_id?: string
          moneda?: string
          nombre?: string
          origen?: string
          precio?: number | null
          precio_tachado?: number | null
          publico_objetivo?: string | null
          slug?: string
          updated_at?: string
          url_origen?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      secciones_landing: {
        Row: {
          contenido: Json
          created_at: string
          id: string
          imagen_ruta: string | null
          landing_id: string
          marca_id: string
          orden: number
          tipo: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          contenido?: Json
          created_at?: string
          id?: string
          imagen_ruta?: string | null
          landing_id: string
          marca_id: string
          orden?: number
          tipo: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          contenido?: Json
          created_at?: string
          id?: string
          imagen_ruta?: string | null
          landing_id?: string
          marca_id?: string
          orden?: number
          tipo?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "secciones_landing_landing_id_marca_id_fkey"
            columns: ["landing_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "landings"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      suscripciones: {
        Row: {
          cancelar_al_final: boolean
          ciclo: string
          created_at: string
          estado: string
          id: string
          id_externo: string | null
          periodo_fin: string
          periodo_inicio: string
          plan_id: string
          plan_siguiente_id: string | null
          proveedor: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          cancelar_al_final?: boolean
          ciclo: string
          created_at?: string
          estado: string
          id?: string
          id_externo?: string | null
          periodo_fin: string
          periodo_inicio: string
          plan_id: string
          plan_siguiente_id?: string | null
          proveedor?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          cancelar_al_final?: boolean
          ciclo?: string
          created_at?: string
          estado?: string
          id?: string
          id_externo?: string | null
          periodo_fin?: string
          periodo_inicio?: string
          plan_id?: string
          plan_siguiente_id?: string | null
          proveedor?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_plan_siguiente_id_fkey"
            columns: ["plan_siguiente_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          acepto_terminos_en: string | null
          avatar_url: string | null
          bloqueado: boolean
          created_at: string
          email: string
          es_admin: boolean
          id: string
          idioma: string
          nombre: string | null
          onboarding_completado: boolean
          pais: string
          tipo_negocio: string | null
          updated_at: string
        }
        Insert: {
          acepto_terminos_en?: string | null
          avatar_url?: string | null
          bloqueado?: boolean
          created_at?: string
          email: string
          es_admin?: boolean
          id: string
          idioma?: string
          nombre?: string | null
          onboarding_completado?: boolean
          pais?: string
          tipo_negocio?: string | null
          updated_at?: string
        }
        Update: {
          acepto_terminos_en?: string | null
          avatar_url?: string | null
          bloqueado?: boolean
          created_at?: string
          email?: string
          es_admin?: boolean
          id?: string
          idioma?: string
          nombre?: string | null
          onboarding_completado?: boolean
          pais?: string
          tipo_negocio?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      versiones_landing: {
        Row: {
          contenido: Json
          creada_por: string | null
          created_at: string
          id: string
          landing_id: string
          marca_id: string
          numero: number
        }
        Insert: {
          contenido: Json
          creada_por?: string | null
          created_at?: string
          id?: string
          landing_id: string
          marca_id: string
          numero: number
        }
        Update: {
          contenido?: Json
          creada_por?: string | null
          created_at?: string
          id?: string
          landing_id?: string
          marca_id?: string
          numero?: number
        }
        Relationships: [
          {
            foreignKeyName: "versiones_landing_creada_por_fkey"
            columns: ["creada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versiones_landing_landing_id_marca_id_fkey"
            columns: ["landing_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "landings"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
      videos: {
        Row: {
          angulo_id: string | null
          config: Json
          created_at: string
          duracion_segundos: number
          estado: string
          formato: string
          guion: string | null
          id: string
          marca_id: string
          producto_id: string
          tipo: string
          updated_at: string
          video_ruta: string | null
        }
        Insert: {
          angulo_id?: string | null
          config?: Json
          created_at?: string
          duracion_segundos: number
          estado?: string
          formato: string
          guion?: string | null
          id?: string
          marca_id: string
          producto_id: string
          tipo: string
          updated_at?: string
          video_ruta?: string | null
        }
        Update: {
          angulo_id?: string | null
          config?: Json
          created_at?: string
          duracion_segundos?: number
          estado?: string
          formato?: string
          guion?: string | null
          id?: string
          marca_id?: string
          producto_id?: string
          tipo?: string
          updated_at?: string
          video_ruta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_angulo_id_fkey"
            columns: ["angulo_id"]
            isOneToOne: false
            referencedRelation: "angulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_producto_id_marca_id_fkey"
            columns: ["producto_id", "marca_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id", "marca_id"]
          },
        ]
      }
    }
    Views: {
      saldos_creditos: {
        Row: {
          saldo_pack: number | null
          saldo_plan: number | null
          saldo_total: number | null
          usuario_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_creditos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
