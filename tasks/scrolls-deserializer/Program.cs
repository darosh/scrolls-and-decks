using System;
using System.IO;
using System.Web.Script.Serialization;
using Animation.Serialization;
using ProtoBuf;

namespace ScrollsDeserializer
{
    class Program
    {
        static void Main(string[] args)
        {
            string input = null;
            string output = null;

            if (args.Length > 0)
            {
                input = args[0];
            }
            else
            {
                Environment.Exit(1);
            }

            if (args.Length > 1)
            {
                output = args[1];
            }

            var st = new FileStream(input, FileMode.Open);
            var ns = new AnimationSerializer();
            var pr = new ProtoBuf.ProtoReader(st, ns, new SerializationContext());
            object ov = null;

            if (input.EndsWith("anims.bytes"))
            {
                ov = new PD_AnimCollection();
            }
            else if (input.EndsWith("spritespos.bytes"))
            {
                ov = new PD_Atlas();
            }

            if (ov != null)
            {
                ns.Deserialize(pr, ov, ov.GetType());
                var json = new JavaScriptSerializer().Serialize(ov);

                if (String.IsNullOrEmpty(output))
                {
                    Console.WriteLine(json);
                }
                else
                {
                    File.WriteAllText(output, json);
                }
            }
        }
    }
}
