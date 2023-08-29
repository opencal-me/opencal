# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for types exported from the `inertia_rails` gem.
# Please instead update this file by running `bin/tapioca gem inertia_rails`.

class ActionDispatch::DebugExceptions
  include ::InertiaDebugExceptions
end

# source://inertia_rails//lib/patches/debug_exceptions/patch-5-1.rb#10
module InertiaDebugExceptions
  # source://inertia_rails//lib/patches/debug_exceptions/patch-5-1.rb#11
  def render_for_browser_request(request, wrapper); end
end

# source://inertia_rails//lib/inertia_rails/lazy.rb#1
module InertiaRails
  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#56
  def threadsafe_html_headers; end

  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#100
  def threadsafe_html_headers=(obj); end

  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#56
  def threadsafe_shared_blocks; end

  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#100
  def threadsafe_shared_blocks=(obj); end

  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#56
  def threadsafe_shared_plain_data; end

  # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#100
  def threadsafe_shared_plain_data=(obj); end

  class << self
    # @yield [Configuration]
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#10
    def configure; end

    # @return [Boolean]
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#35
    def default_render?; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#97
    def evaluated_blocks(controller, blocks); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#39
    def html_headers; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#52
    def html_headers=(headers); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#23
    def layout; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#62
    def lazy(value = T.unsafe(nil), &block); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#56
    def reset!; end

    # "Setters"
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#44
    def share(**args); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#48
    def share_block(block); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#89
    def shared_blocks; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#93
    def shared_blocks=(val); end

    # "Getters"
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#15
    def shared_data(controller); end

    # Getters and setters to provide default values for the threadsafe attributes
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#81
    def shared_plain_data; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#85
    def shared_plain_data=(val); end

    # @return [Boolean]
    #
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#27
    def ssr_enabled?; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#31
    def ssr_url; end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#48
    def threadsafe_html_headers; end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#92
    def threadsafe_html_headers=(obj); end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#48
    def threadsafe_shared_blocks; end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#92
    def threadsafe_shared_blocks=(obj); end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#48
    def threadsafe_shared_plain_data; end

    # source://activesupport/7.0.6/lib/active_support/core_ext/module/attribute_accessors_per_thread.rb#92
    def threadsafe_shared_plain_data=(obj); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#19
    def version; end
  end
end

# source://inertia_rails//lib/inertia_rails/inertia_rails.rb#68
module InertiaRails::Configuration
  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#73
  def default_render; end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#73
  def default_render=(val); end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#69
  def layout; end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#69
  def layout=(val); end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#71
  def ssr_enabled; end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#71
  def ssr_enabled=(val); end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#72
  def ssr_url; end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#72
  def ssr_url=(val); end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#70
  def version; end

  # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#70
  def version=(val); end

  class << self
    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#73
    def default_render; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#73
    def default_render=(val); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#75
    def evaluated_version; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#69
    def layout; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#69
    def layout=(val); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#71
    def ssr_enabled; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#71
    def ssr_enabled=(val); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#72
    def ssr_url; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#72
    def ssr_url=(val); end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#70
    def version; end

    # source://inertia_rails//lib/inertia_rails/inertia_rails.rb#70
    def version=(val); end
  end
end

# source://inertia_rails//lib/inertia_rails/controller.rb#5
module InertiaRails::Controller
  extend ::ActiveSupport::Concern

  requires_ancestor { ActionController::Base }

  mixes_in_class_methods ::InertiaRails::Controller::ClassMethods

  # source://inertia_rails//lib/inertia_rails/controller.rb#32
  def default_render; end

  # source://inertia_rails//lib/inertia_rails/controller.rb#54
  def inertia_view_assigns; end

  # source://inertia_rails//lib/inertia_rails/controller.rb#45
  def redirect_back(fallback_location:, allow_other_host: T.unsafe(nil), **options); end

  sig { params(options: T.untyped, response_options: T::Hash[::Symbol, T.untyped]).void }
  def redirect_to(options = T.unsafe(nil), response_options = T.unsafe(nil)); end

  private

  # source://inertia_rails//lib/inertia_rails/controller.rb#74
  def capture_inertia_errors(options); end

  # source://inertia_rails//lib/inertia_rails/controller.rb#61
  def inertia_layout; end

  # source://inertia_rails//lib/inertia_rails/controller.rb#69
  def inertia_location(url); end
end

# source://inertia_rails//lib/inertia_rails/controller.rb#16
module InertiaRails::Controller::ClassMethods
  # source://inertia_rails//lib/inertia_rails/controller.rb#17
  def inertia_share(**args, &block); end

  # source://inertia_rails//lib/inertia_rails/controller.rb#24
  def use_inertia_instance_props; end
end

# source://inertia_rails//lib/inertia_rails/engine.rb#5
class InertiaRails::Engine < ::Rails::Engine
  class << self
    # source://activesupport/7.0.6/lib/active_support/callbacks.rb#68
    def __callbacks; end
  end
end

# source://inertia_rails//lib/inertia_rails.rb#22
class InertiaRails::Error < ::StandardError; end

# source://inertia_rails//lib/inertia_rails/helper.rb#3
module InertiaRails::Helper
  # source://inertia_rails//lib/inertia_rails/helper.rb#4
  def inertia_headers; end
end

# source://inertia_rails//lib/inertia_rails/lazy.rb#2
class InertiaRails::Lazy
  # @return [Lazy] a new instance of Lazy
  #
  # source://inertia_rails//lib/inertia_rails/lazy.rb#3
  def initialize(value = T.unsafe(nil), &block); end

  # source://inertia_rails//lib/inertia_rails/lazy.rb#8
  def call; end

  # source://inertia_rails//lib/inertia_rails/lazy.rb#12
  def to_proc; end
end

# source://inertia_rails//lib/inertia_rails/middleware.rb#2
class InertiaRails::Middleware
  # @return [Middleware] a new instance of Middleware
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#3
  def initialize(app); end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#7
  def call(env); end
end

# source://inertia_rails//lib/inertia_rails/middleware.rb#14
class InertiaRails::Middleware::InertiaRailsRequest
  # @return [InertiaRailsRequest] a new instance of InertiaRailsRequest
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#15
  def initialize(app, env); end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#20
  def response; end

  private

  # source://inertia_rails//lib/inertia_rails/middleware.rb#88
  def force_refresh(request); end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#58
  def get?; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#50
  def inertia_non_post_redirect?(status); end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#70
  def inertia_request?; end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#66
  def inertia_version; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#34
  def keep_inertia_errors?(status); end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#46
  def non_get_redirectable_method?; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#42
  def redirect_status?(status); end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#62
  def request_method; end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#84
  def saved_version; end

  # source://inertia_rails//lib/inertia_rails/middleware.rb#78
  def sent_version; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#54
  def stale_inertia_get?; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#38
  def stale_inertia_request?; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/middleware.rb#74
  def version_stale?; end
end

# source://inertia_rails//lib/inertia_rails/renderer.rb#6
class InertiaRails::Renderer
  sig { params(args: T.untyped, kwargs: T.untyped).void }
  def initialize(*args, **kwargs); end

  # Returns the value of attribute component.
  #
  # source://inertia_rails//lib/inertia_rails/renderer.rb#7
  def component; end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#19
  def render; end

  # Returns the value of attribute view_data.
  #
  # source://inertia_rails//lib/inertia_rails/renderer.rb#7
  def view_data; end

  private

  # source://inertia_rails//lib/inertia_rails/renderer.rb#65
  def deep_transform_values(hash, proc); end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#40
  def layout; end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#56
  def page; end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#71
  def partial_keys; end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#44
  def props; end

  # source://inertia_rails//lib/inertia_rails/renderer.rb#32
  def render_ssr; end

  # @return [Boolean]
  #
  # source://inertia_rails//lib/inertia_rails/renderer.rb#75
  def rendering_partial_component?; end
end

class InertiaRails::StaticController < ::ApplicationController
  def static; end

  private

  # source://actionview/7.0.6/lib/action_view/layouts.rb#328
  def _layout(lookup_context, formats); end

  class << self
    # source://actionpack/7.0.6/lib/action_controller/metal/params_wrapper.rb#185
    def _wrapper_options; end

    # source://actionpack/7.0.6/lib/action_controller/metal/helpers.rb#63
    def helpers_path; end

    # source://actionpack/7.0.6/lib/action_controller/metal.rb#210
    def middleware_stack; end
  end
end
